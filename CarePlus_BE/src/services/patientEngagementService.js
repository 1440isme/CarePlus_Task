import db from "../models/index";
import CRUDService from "./CRUDService";

const REVIEW_REWARD_POINTS = 50;
const REVIEW_VOUCHER_DISCOUNT = 50000;
const REVIEW_VOUCHER_MIN_ORDER = 300000;
const REVIEW_VOUCHER_DAYS = 30;

const formatCompactMoney = (amount) => {
    const numeric = Number(amount) || 0;
    if (!numeric) return "0K";
    return `${Math.round(numeric / 1000)}K`;
};

const buildDoctorCard = (doctorInstance) => {
    const doctor = typeof doctorInstance.toJSON === "function" ? doctorInstance.toJSON() : doctorInstance;
    return {
        id: doctor.id,
        slug: doctor.slug,
        fullName: doctor.fullName,
        title: doctor.title,
        image: doctor.image,
        consultationFee: doctor.consultationFee,
        consultationFeeLabel: formatCompactMoney(doctor.consultationFee),
        rating: doctor.rating,
        bookedCount: doctor.bookedCount,
        specialty: doctor.specialty ? {
            id: doctor.specialty.id,
            name: doctor.specialty.name,
            slug: doctor.specialty.slug,
        } : null,
    };
};

const getDoctorBySlugOrId = async (slugOrId, options = {}) => {
    const isId = !isNaN(slugOrId) && String(slugOrId).trim() !== "";
    const where = isId ? { id: Number(slugOrId) } : { slug: slugOrId };

    return db.Doctor.findOne({
        where,
        include: [{ model: db.Specialty, as: "specialty" }],
        ...options,
    });
};

const ensureRewardWallet = async (userId, transaction) => {
    const [wallet] = await db.PatientRewardWallet.findOrCreate({
        where: { userId },
        defaults: { userId, points: 0, totalEarned: 0 },
        transaction,
    });
    return wallet;
};

const generateVoucherCode = (userId) => {
    const timestamp = Date.now().toString().slice(-6);
    return `CP-${userId}-${timestamp}`;
};

const recalculateDoctorRating = async (doctorId, transaction) => {
    const reviews = await db.DoctorReview.findAll({
        where: { doctorId },
        attributes: ["rating"],
        transaction,
    });

    const averageRating = reviews.length
        ? Number((reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1))
        : 4.5;

    const doctor = await db.Doctor.findByPk(doctorId, { transaction });
    if (doctor) {
        doctor.rating = averageRating;
        await doctor.save({ transaction });
    }

    return averageRating;
};

const listDoctorReviews = async (doctorId, limit = 5) => {
    const reviews = await db.DoctorReview.findAll({
        where: { doctorId },
        order: [["createdAt", "DESC"]],
        limit,
        include: [{
            model: db.User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "username", "avatar"],
        }],
    });

    const total = await db.DoctorReview.count({ where: { doctorId } });
    const ratingAvgRaw = await db.DoctorReview.findAll({
        where: { doctorId },
        attributes: [[db.Sequelize.fn("AVG", db.Sequelize.col("rating")), "avgRating"]],
        raw: true,
    });
    const avgRating = Number(ratingAvgRaw?.[0]?.avgRating || 0);

    return {
        total,
        averageRating: Number(avgRating.toFixed(1)),
        items: reviews.map((review) => {
            const item = review.toJSON();
            const name = [item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ").trim() || item.user?.username || "Bệnh nhân";
            return {
                id: item.id,
                rating: item.rating,
                comment: item.comment,
                visitDate: item.visitDate,
                rewardPoints: item.rewardPoints,
                voucherCode: item.voucherCode,
                createdAt: item.createdAt,
                user: {
                    id: item.user?.id,
                    name,
                    avatar: item.user?.avatar || null,
                },
            };
        }),
    };
};

const getDoctorEngagementSummary = async (doctorId) => {
    const [favoriteCount, viewCount, reviewSummary] = await Promise.all([
        db.FavoriteDoctor.count({ where: { doctorId } }),
        db.DoctorViewHistory.count({ where: { doctorId } }),
        listDoctorReviews(doctorId, 4),
    ]);

    return {
        favoriteCount,
        viewCount,
        reviewCount: reviewSummary.total,
        averageRating: reviewSummary.averageRating,
        latestReviews: reviewSummary.items,
    };
};

const trackDoctorView = async (userId, slugOrId) => {
    const doctor = await getDoctorBySlugOrId(slugOrId);
    if (!doctor) {
        const error = new Error("Không tìm thấy bác sĩ");
        error.status = 404;
        throw error;
    }

    await db.DoctorViewHistory.upsert({
        userId,
        doctorId: doctor.id,
        viewedAt: new Date(),
    });

    return { success: true };
};

const toggleFavoriteDoctor = async (userId, doctorId) => {
    const doctor = await db.Doctor.findByPk(doctorId, {
        include: [{ model: db.Specialty, as: "specialty" }],
    });
    if (!doctor) {
        const error = new Error("Không tìm thấy bác sĩ");
        error.status = 404;
        throw error;
    }

    const existing = await db.FavoriteDoctor.findOne({
        where: { userId, doctorId: doctor.id },
    });

    if (existing) {
        await existing.destroy();
        return {
            isFavorited: false,
            doctor: buildDoctorCard(doctor),
        };
    }

    await db.FavoriteDoctor.create({ userId, doctorId: doctor.id });
    return {
        isFavorited: true,
        doctor: buildDoctorCard(doctor),
    };
};

const submitDoctorReview = async (userId, payload = {}) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        if (user.role !== "user") {
            throw new Error("Chỉ bệnh nhân mới có thể đánh giá bác sĩ");
        }

        await CRUDService.ensurePatientProfile(user, transaction);

        const doctor = await getDoctorBySlugOrId(payload.doctorId || payload.slugOrId, { transaction });
        if (!doctor) {
            throw new Error("Không tìm thấy bác sĩ");
        }

        const rating = Number(payload.rating);
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new Error("Điểm đánh giá phải từ 1 đến 5");
        }

        const comment = String(payload.comment || "").trim();
        if (comment.length < 10) {
            throw new Error("Vui lòng nhập nhận xét ít nhất 10 ký tự");
        }

        const existed = await db.DoctorReview.findOne({
            where: { userId, doctorId: doctor.id },
            transaction,
        });
        if (existed) {
            throw new Error("Bạn đã đánh giá bác sĩ này rồi");
        }

        const wallet = await ensureRewardWallet(userId, transaction);
        const voucherCode = generateVoucherCode(userId);
        const visitDate = payload.visitDate || new Date().toISOString().slice(0, 10);

        const review = await db.DoctorReview.create({
            userId,
            doctorId: doctor.id,
            rating,
            comment,
            visitDate,
            rewardPoints: REVIEW_REWARD_POINTS,
            voucherCode,
        }, { transaction });

        wallet.points += REVIEW_REWARD_POINTS;
        wallet.totalEarned += REVIEW_REWARD_POINTS;
        await wallet.save({ transaction });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + REVIEW_VOUCHER_DAYS);

        await db.PatientVoucher.create({
            userId,
            reviewId: review.id,
            code: voucherCode,
            title: "Ưu đãi cảm ơn sau đánh giá",
            description: "Giảm phí khám cho lần đặt lịch kế tiếp sau khi gửi đánh giá.",
            discountAmount: REVIEW_VOUCHER_DISCOUNT,
            minOrderValue: REVIEW_VOUCHER_MIN_ORDER,
            expiresAt,
            isUsed: false,
        }, { transaction });

        await recalculateDoctorRating(doctor.id, transaction);
        await transaction.commit();

        return {
            success: true,
            reward: {
                pointsEarned: REVIEW_REWARD_POINTS,
                voucherCode,
                discountAmount: REVIEW_VOUCHER_DISCOUNT,
                expiresAt,
            },
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getMyEngagement = async (userId) => {
    const [wallet, favorites, views, myReviews, vouchers] = await Promise.all([
        db.PatientRewardWallet.findOne({ where: { userId } }),
        db.FavoriteDoctor.findAll({
            where: { userId },
            limit: 8,
            order: [["createdAt", "DESC"]],
            include: [{
                model: db.Doctor,
                as: "doctor",
                include: [{ model: db.Specialty, as: "specialty" }],
            }],
        }),
        db.DoctorViewHistory.findAll({
            where: { userId },
            limit: 8,
            order: [["viewedAt", "DESC"]],
            include: [{
                model: db.Doctor,
                as: "doctor",
                include: [{ model: db.Specialty, as: "specialty" }],
            }],
        }),
        db.DoctorReview.findAll({
            where: { userId },
            limit: 8,
            order: [["createdAt", "DESC"]],
            include: [{
                model: db.Doctor,
                as: "doctor",
                include: [{ model: db.Specialty, as: "specialty" }],
            }],
        }),
        db.PatientVoucher.findAll({
            where: { userId },
            limit: 8,
            order: [["createdAt", "DESC"]],
        }),
    ]);

    return {
        rewardWallet: {
            points: wallet?.points || 0,
            totalEarned: wallet?.totalEarned || 0,
        },
        favoriteDoctorIds: favorites.map((item) => item.doctorId),
        favoriteDoctors: favorites.map((item) => ({
            id: item.id,
            createdAt: item.createdAt,
            doctor: buildDoctorCard(item.doctor),
        })),
        recentlyViewedDoctors: views.map((item) => ({
            id: item.id,
            viewedAt: item.viewedAt,
            doctor: buildDoctorCard(item.doctor),
        })),
        myReviews: myReviews.map((item) => ({
            id: item.id,
            rating: item.rating,
            comment: item.comment,
            visitDate: item.visitDate,
            rewardPoints: item.rewardPoints,
            voucherCode: item.voucherCode,
            createdAt: item.createdAt,
            doctor: buildDoctorCard(item.doctor),
        })),
        vouchers: vouchers.map((item) => ({
            id: item.id,
            code: item.code,
            title: item.title,
            description: item.description,
            discountAmount: item.discountAmount,
            minOrderValue: item.minOrderValue,
            expiresAt: item.expiresAt,
            isUsed: item.isUsed,
        })),
    };
};

module.exports = {
    getDoctorEngagementSummary,
    listDoctorReviews,
    trackDoctorView,
    toggleFavoriteDoctor,
    submitDoctorReview,
    getMyEngagement,
};

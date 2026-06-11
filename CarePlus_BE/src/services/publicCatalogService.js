import db from "../models/index";

const CLINIC_INFO = {
    name: "CarePlus Clinic",
    phone: "1900 1234",
    email: "lienhe@careplus.vn",
    address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh",
    workingHours: [
        "Thứ 2 – Thứ 6: 7:30 – 17:00",
        "Thứ 7: 7:30 – 12:00",
        "Chủ nhật: Nghỉ",
    ],
};

const articles = [
    {
        id: 201,
        slug: "phong-ngua-benh-tim-mach-hieu-qua-tai-nha",
        category: "Tim mạch",
        title: "Phòng ngừa bệnh tim mạch hiệu quả tại nhà",
        summary: "Những biện pháp đơn giản giúp bảo vệ trái tim khỏe mạnh mỗi ngày.",
        publishedAt: "2026-05-21",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Bệnh tim mạch là một trong những nguyên nhân hàng đầu gây ảnh hưởng đến chất lượng sống. Việc xây dựng thói quen sinh hoạt lành mạnh có thể giúp bạn giảm đáng kể nguy cơ mắc bệnh.",
            "Hãy ưu tiên chế độ ăn ít muối, tăng rau xanh, ngủ đủ giấc và duy trì vận động ít nhất 30 phút mỗi ngày. Đồng thời, nên kiểm tra huyết áp và mỡ máu định kỳ nếu bạn thuộc nhóm nguy cơ.",
            "Nếu xuất hiện các dấu hiệu như đau ngực, khó thở, hồi hộp kéo dài hoặc tăng huyết áp không kiểm soát, bạn nên đặt lịch khám sớm với bác sĩ tim mạch để được đánh giá chuyên sâu.",
        ],
        relatedIds: [202, 203, 204],
        isLatest: true,
    },
    {
        id: 202,
        slug: "che-do-an-uong-tot-cho-nguoi-benh-tieu-hoa",
        category: "Tiêu hóa",
        title: "Chế độ ăn uống tốt cho người bệnh tiêu hóa",
        summary: "Gợi ý thực đơn và lưu ý sinh hoạt giúp hệ tiêu hóa phục hồi tốt hơn.",
        publishedAt: "2026-05-16",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Người có vấn đề tiêu hóa nên ưu tiên các bữa ăn nhỏ, dễ tiêu, hạn chế đồ cay nóng và thức uống có gas.",
            "Việc theo dõi phản ứng của cơ thể với từng nhóm thực phẩm sẽ giúp bạn điều chỉnh thực đơn phù hợp, đặc biệt khi có trào ngược hoặc hội chứng ruột kích thích.",
            "Khám bác sĩ sớm nếu bạn đau bụng kéo dài, sụt cân không rõ nguyên nhân hoặc rối loạn tiêu hóa tái diễn nhiều lần.",
        ],
        relatedIds: [201, 203, 204],
        isLatest: true,
    },
    {
        id: 203,
        slug: "cach-cham-soc-da-dung-cach-trong-mua-he",
        category: "Da liễu",
        title: "Cách chăm sóc da đúng cách trong mùa hè",
        summary: "Bảo vệ da trước nắng nóng, dầu thừa và kích ứng trong thời tiết oi bức.",
        publishedAt: "2026-05-11",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Mùa hè khiến da dễ tăng tiết dầu, kích ứng và sạm màu nếu không được bảo vệ đúng cách.",
            "Bạn nên ưu tiên kem chống nắng phổ rộng, làm sạch nhẹ nhàng và tránh lạm dụng hoạt chất mạnh khi da đang nhạy cảm.",
            "Nếu da nổi mụn kéo dài, đỏ rát hoặc bong tróc bất thường, hãy gặp bác sĩ da liễu để được tư vấn phác đồ phù hợp.",
        ],
        relatedIds: [201, 202, 204],
        isLatest: true,
    },
    {
        id: 204,
        slug: "dinh-duong-cho-tre-em-trong-giai-doan-phat-trien",
        category: "Nhi khoa",
        title: "Dinh dưỡng cho trẻ em trong giai đoạn phát triển",
        summary: "Những nguyên tắc nền tảng giúp trẻ phát triển chiều cao và đề kháng tốt hơn.",
        publishedAt: "2026-05-06",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=80",
        content: [
            "Trẻ em cần được cung cấp đủ đạm, chất béo tốt, vitamin và khoáng chất theo từng giai đoạn phát triển.",
            "Phụ huynh nên theo dõi cân nặng, chiều cao định kỳ và chú ý đến giấc ngủ, mức độ vận động, thói quen ăn uống của trẻ.",
            "Khi trẻ biếng ăn kéo dài, chậm tăng trưởng hoặc thường xuyên mắc bệnh, nên khám bác sĩ nhi để được đánh giá toàn diện.",
        ],
        relatedIds: [201, 202, 203],
        isLatest: false,
    },
];

const ADMIN_PAGE_SIZE = 20;

const slugify = (value = "") => {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const formatCompactMoney = (amount) => {
    const numeric = Number(amount) || 0;
    if (!numeric) return "0K";
    return `${Math.round(numeric / 1000)}K`;
};

const enrichDoctor = (doctor) => {
    const specialty = doctor.specialty;
    return {
        ...doctor,
        specialtyName: specialty?.name || "Chưa phân loại",
        consultationFeeLabel: formatCompactMoney(doctor.consultationFee),
        ratingLabel: `⭐ ${doctor.rating || 0} (${doctor.bookedCount || 0})`,
    };
};

const sortByQuery = (items, sort) => {
    const list = [...items];

    switch (sort) {
        case "fee_asc":
            return list.sort((a, b) => (a.consultationFee || 0) - (b.consultationFee || 0));
        case "fee_desc":
            return list.sort((a, b) => (b.consultationFee || 0) - (a.consultationFee || 0));
        case "booked_desc":
            return list.sort((a, b) => (b.bookedCount || 0) - (a.bookedCount || 0));
        case "rating_desc":
            return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case "name_asc":
            return list.sort((a, b) => (a.name || a.fullName).localeCompare(b.name || b.fullName, "vi"));
        case "latest":
            return list.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
        default:
            return list;
    }
};

const buildSlotsForDoctor = (doctor, dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return [];
    }

    const day = date.getDay();
    const availabilityDays = Array.isArray(doctor.availabilityDays)
        ? doctor.availabilityDays
        : JSON.parse(doctor.availabilityDays || "[]");

    if (!availabilityDays.includes(day)) {
        return [];
    }

    const shiftSlots = {
        MORNING: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"],
        AFTERNOON: ["13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
    };

    const shifts = Array.isArray(doctor.shifts)
        ? doctor.shifts
        : JSON.parse(doctor.shifts || "[]");

    const slots = shifts.flatMap((shift) => shiftSlots[shift] || []);
    const limited = slots.slice(0, Math.max(doctor.availableSlotsToday, 1));

    return limited.map((startTime) => {
        const [hour, minute] = startTime.split(":").map(Number);
        const end = new Date(date);
        end.setHours(hour, minute + 30, 0, 0);
        return {
            startTime,
            endTime: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
            available: true,
        };
    });
};

const getSpecialtyById = async (specialtyId) => {
    const spec = await db.Specialty.findByPk(specialtyId);
    return spec ? spec.toJSON() : null;
};

const ensureSpecialtyExists = async (specialtyId) => {
    const specialty = await getSpecialtyById(Number(specialtyId));
    if (!specialty) {
        const error = new Error("Chuyên khoa không tồn tại");
        error.status = 400;
        throw error;
    }
    return specialty;
};

const ensureUniqueSpecialty = async ({ name, slug }, excludeId) => {
    const normalizedSlug = slugify(slug || name);
    const where = {
        [db.Sequelize.Op.or]: [
            { slug: normalizedSlug },
            { name: String(name).trim() }
        ]
    };
    if (excludeId) {
        where.id = { [db.Sequelize.Op.ne]: excludeId };
    }
    const duplicated = await db.Specialty.findOne({ where });
    if (duplicated) {
        const error = new Error("Tên hoặc slug chuyên khoa đã tồn tại");
        error.status = 409;
        throw error;
    }
    return normalizedSlug;
};

const ensureUniqueDoctor = async ({ fullName, slug }, excludeId) => {
    const normalizedSlug = slugify(slug || fullName);
    const where = {
        [db.Sequelize.Op.or]: [
            { slug: normalizedSlug },
            { fullName: String(fullName).trim() }
        ]
    };
    if (excludeId) {
        where.id = { [db.Sequelize.Op.ne]: excludeId };
    }
    const duplicated = await db.Doctor.findOne({ where });
    if (duplicated) {
        const error = new Error("Tên hoặc slug bác sĩ đã tồn tại");
        error.status = 409;
        throw error;
    }
    return normalizedSlug;
};

const sanitizeSpecialtyPayload = async (payload = {}, existing = {}) => {
    const name = String(payload.name || existing.name || "").trim();
    if (!name) {
        const error = new Error("Tên chuyên khoa là bắt buộc");
        error.status = 400;
        throw error;
    }

    const slug = await ensureUniqueSpecialty({ name, slug: payload.slug }, existing.id);

    return {
        name,
        slug,
        summary: String(payload.summary || existing.summary || "").trim(),
        description: String(payload.description || existing.description || "").trim(),
        icon: String(payload.icon || existing.icon || "🩺").trim(),
        color: String(payload.color || existing.color || "from-sky-50 to-cyan-50").trim(),
        popularityRank: Number(payload.popularityRank ?? existing.popularityRank ?? 1),
        isActive: payload.isActive === undefined ? Boolean(existing.isActive ?? true) : String(payload.isActive) !== "false",
        coverImage: String(payload.coverImage || existing.coverImage || "").trim(),
    };
};

const sanitizeDoctorPayload = async (payload = {}, existing = {}) => {
    const fullName = String(payload.fullName || existing.fullName || "").trim();
    if (!fullName) {
        const error = new Error("Tên bác sĩ là bắt buộc");
        error.status = 400;
        throw error;
    }

    const specialtyId = Number(payload.specialtyId ?? existing.specialtyId);
    await ensureSpecialtyExists(specialtyId);

    const parsedFee = Number(payload.consultationFee ?? existing.consultationFee ?? 0);
    const parsedExperience = Number(payload.experienceYears ?? existing.experienceYears ?? 0);
    const parsedRating = Number(payload.rating ?? existing.rating ?? 0);
    const parsedBooked = Number(payload.bookedCount ?? existing.bookedCount ?? 0);
    const parsedSlots = Number(payload.availableSlotsToday ?? existing.availableSlotsToday ?? 0);

    const slug = await ensureUniqueDoctor({ fullName, slug: payload.slug }, existing.id);

    return {
        fullName,
        slug,
        title: String(payload.title || existing.title || "").trim(),
        specialtyId,
        gender: String(payload.gender || existing.gender || "OTHER").toUpperCase(),
        experienceYears: Number.isNaN(parsedExperience) ? 0 : parsedExperience,
        consultationFee: Number.isNaN(parsedFee) ? 0 : parsedFee,
        bookedCount: Number.isNaN(parsedBooked) ? 0 : parsedBooked,
        availableSlotsToday: Number.isNaN(parsedSlots) ? 0 : parsedSlots,
        rating: Number.isNaN(parsedRating) ? 0 : parsedRating,
        bio: String(payload.bio || existing.bio || "").trim(),
        hospital: String(payload.hospital || existing.hospital || CLINIC_INFO.name).trim(),
        image: String(payload.image || existing.image || "").trim(),
        gallery: Array.isArray(payload.gallery)
            ? payload.gallery.filter(Boolean)
            : String(payload.gallery || "")
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 6),
        highlights: Array.isArray(payload.highlights)
            ? payload.highlights.filter(Boolean)
            : String(payload.highlights || "")
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 6),
        availabilityDays: Array.isArray(payload.availabilityDays)
            ? payload.availabilityDays.map((item) => Number(item)).filter((item) => !Number.isNaN(item))
            : existing.availabilityDays || [1, 2, 3, 4, 5],
        shifts: Array.isArray(payload.shifts)
            ? payload.shifts.map((item) => String(item).toUpperCase()).filter(Boolean)
            : existing.shifts || ["MORNING"],
        isFeatured: payload.isFeatured === undefined ? Boolean(existing.isFeatured ?? false) : String(payload.isFeatured) === "true",
        isTopBooked: payload.isTopBooked === undefined ? Boolean(existing.isTopBooked ?? false) : String(payload.isTopBooked) === "true",
        isActive: payload.isActive === undefined ? Boolean(existing.isActive ?? true) : String(payload.isActive) !== "false",
    };
};

const listSpecialties = async (query = {}) => {
    const keyword = (query.search || "").trim();
    const where = { is_active: true };
    if (keyword) {
        where[db.Sequelize.Op.or] = [
            { name: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { summary: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { description: { [db.Sequelize.Op.like]: `%${keyword}%` } }
        ];
    }
    const order = [];
    if (query.sort === "popular") {
        order.push(["popularityRank", "ASC"]);
    } else {
        order.push(["name", "ASC"]);
    }
    const list = await db.Specialty.findAll({
        where,
        order,
        include: [{
            model: db.Doctor,
            as: "doctors",
            where: { is_active: true },
            required: false
        }]
    });
    const items = list.map(item => {
        const json = item.toJSON();
        return {
            ...json,
            doctorCount: json.doctors ? json.doctors.length : 0,
            doctors: json.doctors ? json.doctors.length : 0
        };
    });
    return {
        items,
        total: items.length
    };
};

const getSpecialtyDetail = async (slugOrId) => {
    const isId = !isNaN(slugOrId) && String(slugOrId).trim() !== "";
    const where = isId ? { id: Number(slugOrId) } : { slug: slugOrId };
    where.is_active = true;
    const specialty = await db.Specialty.findOne({ where });
    if (!specialty) return null;
    const doctorsList = await db.Doctor.findAll({
        where: { specialtyId: specialty.id, is_active: true },
        include: [{ model: db.Specialty, as: "specialty" }]
    });
    return {
        ...specialty.toJSON(),
        doctors: doctorsList.map(doc => enrichDoctor(doc.toJSON()))
    };
};

const listDoctors = async (query = {}) => {
    const keyword = (query.search || "").trim();
    const where = { is_active: true };

    if (keyword) {
        where[db.Sequelize.Op.or] = [
            { fullName: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { title: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { bio: { [db.Sequelize.Op.like]: `%${keyword}%` } }
        ];
    }
    if (query.specialty) {
        const specWhere = isNaN(query.specialty) ? { slug: query.specialty } : { id: Number(query.specialty) };
        const specialty = await db.Specialty.findOne({ where: specWhere });
        if (specialty) {
            where.specialtyId = specialty.id;
        } else {
            return { items: [], total: 0 };
        }
    }
    if (query.gender) {
        where.gender = String(query.gender).toUpperCase();
    }
    if (query.minFee) {
        where.consultationFee = { ...where.consultationFee, [db.Sequelize.Op.gte]: Number(query.minFee) };
    }
    if (query.maxFee) {
        where.consultationFee = { ...where.consultationFee, [db.Sequelize.Op.lte]: Number(query.maxFee) };
    }
    if (query.minExperience) {
        where.experienceYears = { [db.Sequelize.Op.gte]: Number(query.minExperience) };
    }
    if (query.availableOnly === "true") {
        where.availableSlotsToday = { [db.Sequelize.Op.gt]: 0 };
    }

    let order = [];
    if (query.sort === "fee_asc") {
        order.push(["consultationFee", "ASC"]);
    } else if (query.sort === "fee_desc") {
        order.push(["consultationFee", "DESC"]);
    } else if (query.sort === "booked_desc") {
        order.push(["bookedCount", "DESC"]);
    } else if (query.sort === "rating_desc") {
        order.push(["rating", "DESC"]);
    } else if (query.sort === "name_asc") {
        order.push(["fullName", "ASC"]);
    } else {
        order.push(["bookedCount", "DESC"]);
    }

    const list = await db.Doctor.findAll({
        where,
        order,
        include: [{ model: db.Specialty, as: "specialty" }]
    });

    let results = list.map(item => enrichDoctor(item.toJSON()));
    if (query.date) {
        results = results.filter(doctor => buildSlotsForDoctor(doctor, query.date).length > 0);
    }
    return {
        items: results,
        total: results.length
    };
};

const getDoctorDetail = async (slugOrId) => {
    const isId = !isNaN(slugOrId) && String(slugOrId).trim() !== "";
    const where = isId ? { id: Number(slugOrId) } : { slug: slugOrId };
    where.is_active = true;
    const doctor = await db.Doctor.findOne({
        where,
        include: [{ model: db.Specialty, as: "specialty" }]
    });
    if (!doctor) return null;
    const enriched = enrichDoctor(doctor.toJSON());

    const related = await db.Doctor.findAll({
        where: {
            specialtyId: doctor.specialtyId,
            id: { [db.Sequelize.Op.ne]: doctor.id },
            is_active: true
        },
        limit: 3,
        include: [{ model: db.Specialty, as: "specialty" }]
    });

    const nextThreeDays = Array.from({ length: 3 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        const dateString = date.toISOString().slice(0, 10);
        return {
            date: dateString,
            slots: buildSlotsForDoctor(enriched, dateString),
        };
    });

    return {
        ...enriched,
        relatedDoctors: related.map(r => enrichDoctor(r.toJSON())),
        schedules: nextThreeDays
    };
};

const listArticles = (query = {}) => {
    const keyword = (query.search || "").trim().toLowerCase();
    let results = [...articles];

    if (keyword) {
        results = results.filter((item) =>
            `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(keyword)
        );
    }

    if (query.category) {
        results = results.filter((item) => item.category.toLowerCase() === String(query.category).toLowerCase());
    }

    results = sortByQuery(results, query.sort || "latest");

    return {
        items: results,
        total: results.length,
        categories: [...new Set(articles.map((item) => item.category))],
    };
};

const getArticleDetail = (slugOrId) => {
    const article = resolveBySlugOrId(articles, slugOrId);
    if (!article) {
        return null;
    }

    return {
        ...article,
        relatedArticles: articles.filter((item) => article.relatedIds.includes(item.id)),
    };
};

const resolveBySlugOrId = (items, slugOrId) => {
    return items.find((item) => String(item.id) === String(slugOrId) || item.slug === slugOrId);
};

const getAvailableSlots = async (slugOrId, date) => {
    const isId = !isNaN(slugOrId) && String(slugOrId).trim() !== "";
    const where = isId ? { id: Number(slugOrId) } : { slug: slugOrId };
    where.is_active = true;
    const doctor = await db.Doctor.findOne({ where });
    if (!doctor) return null;
    return buildSlotsForDoctor(doctor.toJSON(), date);
};

const getHomeData = async () => {
    const activeSpecs = await db.Specialty.findAll({
        where: { is_active: true },
        limit: 8,
        order: [["popularityRank", "ASC"]]
    });

    const specsJson = await Promise.all(activeSpecs.map(async (spec) => {
        const count = await db.Doctor.count({ where: { specialtyId: spec.id, is_active: true } });
        return {
            ...spec.toJSON(),
            doctors: count,
            doctorCount: count
        };
    }));

    const featuredDocs = await db.Doctor.findAll({
        where: { isFeatured: true, is_active: true },
        limit: 4,
        include: [{ model: db.Specialty, as: "specialty" }]
    });

    const topBookedDocs = await db.Doctor.findAll({
        where: { is_active: true },
        order: [["bookedCount", "DESC"]],
        limit: 4,
        include: [{ model: db.Specialty, as: "specialty" }]
    });

    const totalSpecs = await db.Specialty.count({ where: { is_active: true } });
    const totalDocs = await db.Doctor.count({ where: { is_active: true } });

    const latestArticles = sortByQuery(articles, "latest").slice(0, 4);

    return {
        clinicInfo: CLINIC_INFO,
        stats: {
            specialties: totalSpecs,
            doctors: totalDocs,
            trustedPatients: 1000,
            averageRating: 4.8
        },
        featuredSpecialties: specsJson,
        featuredDoctors: featuredDocs.map(d => enrichDoctor(d.toJSON())),
        topBookedDoctors: topBookedDocs.map(d => enrichDoctor(d.toJSON())),
        latestArticles
    };
};

const getAdminDashboardData = async () => {
    const totalSpecs = await db.Specialty.count({ where: { is_active: true } });
    const activeDocs = await db.Doctor.findAll({
        where: { is_active: true },
        include: [{ model: db.Specialty, as: "specialty" }]
    });
    const allDocs = await db.Doctor.findAll();

    const totalBookings = allDocs.reduce((total, item) => total + (item.bookedCount || 0), 0);
    const averageFee = activeDocs.length
        ? Math.round(activeDocs.reduce((total, item) => total + (item.consultationFee || 0), 0) / activeDocs.length)
        : 0;
    const averageRating = activeDocs.length
        ? Number((activeDocs.reduce((total, item) => total + (item.rating || 0), 0) / activeDocs.length).toFixed(1))
        : 0;

    const allSpecs = await db.Specialty.findAll();
    const topSpecsRaw = await Promise.all(allSpecs.map(async (spec) => {
        const count = await db.Doctor.count({ where: { specialtyId: spec.id, is_active: true } });
        return {
            id: spec.id,
            name: spec.name,
            doctorCount: count
        };
    }));
    const topSpecialties = topSpecsRaw.sort((a, b) => b.doctorCount - a.doctorCount).slice(0, 4);

    const recentDoctorsRaw = [...activeDocs].sort((a, b) => b.bookedCount - a.bookedCount).slice(0, 5);

    return {
        stats: [
            {
                key: "specialties",
                title: "Chuyên khoa đang hoạt động",
                value: totalSpecs,
                description: "Nhóm dịch vụ đang mở cho bệnh nhân đặt lịch.",
            },
            {
                key: "doctors",
                title: "Bác sĩ đang hoạt động",
                value: activeDocs.length,
                description: "Đang hiển thị ở trang công khai và có thể được đặt lịch.",
            },
            {
                key: "bookings",
                title: "Tổng lượt đặt lịch mẫu",
                value: totalBookings,
                description: "Dùng để minh họa dữ liệu quản trị hiện tại.",
            },
            {
                key: "rating",
                title: "Điểm đánh giá trung bình",
                value: averageRating,
                description: "Tính trên toàn bộ bác sĩ đang hoạt động.",
            },
        ],
        highlights: {
            averageFee,
            pendingDoctorProfiles: allDocs.filter((item) => !item.isActive).length,
            featuredDoctors: activeDocs.filter((item) => item.isFeatured).length,
            topSpecialties,
        },
        recentDoctors: recentDoctorsRaw.map(d => enrichDoctor(d.toJSON()))
    };
};

const listAdminSpecialties = async (query = {}) => {
    const keyword = String(query.search || "").trim().toLowerCase();
    const where = {};
    if (query.status === "active") {
        where.is_active = true;
    } else if (query.status === "inactive") {
        where.is_active = false;
    }

    if (keyword) {
        where[db.Sequelize.Op.or] = [
            { name: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { summary: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { description: { [db.Sequelize.Op.like]: `%${keyword}%` } }
        ];
    }

    const order = [["name", "ASC"]];

    const list = await db.Specialty.findAll({
        where,
        order
    });

    const items = await Promise.all(list.map(async (item) => {
        const count = await db.Doctor.count({ where: { specialtyId: item.id } });
        return {
            ...item.toJSON(),
            doctorCount: count,
            doctors: count
        };
    }));

    return {
        items,
        total: items.length,
        pageSize: ADMIN_PAGE_SIZE
    };
};

const createSpecialty = async (payload = {}) => {
    const specialty = await sanitizeSpecialtyPayload(payload);
    const record = await db.Specialty.create(specialty);
    return record.toJSON();
};

const updateSpecialty = async (id, payload = {}) => {
    const current = await db.Specialty.findByPk(id);
    if (!current) return null;

    const updated = await sanitizeSpecialtyPayload(payload, current.toJSON());
    await current.update(updated);
    return current.toJSON();
};

const deleteSpecialty = async (id) => {
    const current = await db.Specialty.findByPk(id);
    if (!current) return false;

    const hasDoctors = await db.Doctor.count({ where: { specialtyId: id } });
    if (hasDoctors > 0) {
        const error = new Error("Không thể xóa chuyên khoa đang có bác sĩ liên kết");
        error.status = 409;
        throw error;
    }

    await current.destroy();
    return true;
};

const listAdminDoctors = async (query = {}) => {
    const keyword = String(query.search || "").trim();
    const where = {};
    if (query.status === "active") {
        where.is_active = true;
    } else if (query.status === "inactive") {
        where.is_active = false;
    }
    if (query.specialtyId) {
        where.specialtyId = Number(query.specialtyId);
    }

    if (keyword) {
        where[db.Sequelize.Op.or] = [
            { fullName: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { title: { [db.Sequelize.Op.like]: `%${keyword}%` } },
            { bio: { [db.Sequelize.Op.like]: `%${keyword}%` } }
        ];
    }

    const order = [["bookedCount", "DESC"]];

    const list = await db.Doctor.findAll({
        where,
        order,
        include: [{ model: db.Specialty, as: "specialty" }]
    });

    return {
        items: list.map(d => enrichDoctor(d.toJSON())),
        total: list.length,
        pageSize: ADMIN_PAGE_SIZE
    };
};

const createDoctor = async (payload = {}) => {
    const doctor = await sanitizeDoctorPayload(payload);
    const record = await db.Doctor.create(doctor);
    const refetched = await db.Doctor.findByPk(record.id, {
        include: [{ model: db.Specialty, as: "specialty" }]
    });
    return enrichDoctor(refetched.toJSON());
};

const updateDoctor = async (id, payload = {}) => {
    const current = await db.Doctor.findByPk(id);
    if (!current) return null;

    const updated = await sanitizeDoctorPayload(payload, current.toJSON());
    await current.update(updated);
    const refetched = await db.Doctor.findByPk(id, {
        include: [{ model: db.Specialty, as: "specialty" }]
    });
    return enrichDoctor(refetched.toJSON());
};

const deleteDoctor = async (id) => {
    const current = await db.Doctor.findByPk(id);
    if (!current) return false;
    await current.destroy();
    return true;
};

module.exports = {
    getHomeData,
    listSpecialties,
    getSpecialtyDetail,
    listDoctors,
    getDoctorDetail,
    getAvailableSlots,
    listArticles,
    getArticleDetail,
    getAdminDashboardData,
    listAdminSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    listAdminDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
};

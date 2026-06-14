import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);
const ACTIVE_PATIENT_ROLE = "user";
const safeUserAttributes = {
    exclude: ["password", "otpCode", "otpExpiresAt"],
};

const hashUserPassword = async (password) => {
    return bcrypt.hashSync(password, salt);
};

const splitFullName = (fullName = "") => {
    const normalized = fullName.trim().replace(/\s+/g, " ");
    if (!normalized) {
        return { firstName: null, lastName: null };
    }

    const parts = normalized.split(" ");
    if (parts.length === 1) {
        return { firstName: null, lastName: parts[0] };
    }

    return {
        firstName: parts.slice(0, -1).join(" "),
        lastName: parts[parts.length - 1],
    };
};

const joinLegacyFullName = (user, patientProfile) => {
    const profileFullName = patientProfile?.fullName?.trim();
    if (profileFullName) {
        return profileFullName;
    }

    const legacy = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
    if (legacy) {
        return legacy;
    }

    return user?.username || user?.email || "Bệnh nhân";
};

const normalizeGenderInput = (value) => {
    if (value === null || typeof value === "undefined" || value === "") {
        return null;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toUpperCase();
        if (["MALE", "FEMALE", "OTHER"].includes(normalized)) {
            return normalized;
        }

        if (normalized === "TRUE" || normalized === "1" || normalized === "NAM") {
            return "MALE";
        }

        if (normalized === "FALSE" || normalized === "0" || normalized === "NỮ" || normalized === "NU") {
            return "FEMALE";
        }
    }

    if (value === true || value === 1) {
        return "MALE";
    }

    if (value === false || value === 0) {
        return "FEMALE";
    }

    return null;
};

const mapGenderToLegacyBoolean = (gender) => {
    if (gender === "MALE") return true;
    if (gender === "FEMALE") return false;
    return null;
};

const normalizeDateInput = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error("Ngày sinh không hợp lệ");
    }
    return date.toISOString().slice(0, 10);
};

const ensurePatientProfile = async (user, transaction) => {
    if (!user || user.role !== ACTIVE_PATIENT_ROLE) {
        return null;
    }

    const existingProfile = await db.PatientProfile.findOne({
        where: { userId: user.id },
        transaction,
    });

    if (existingProfile) {
        return existingProfile;
    }

    const fullName = joinLegacyFullName(user, null);
    return db.PatientProfile.create({
        userId: user.id,
        fullName,
        gender: normalizeGenderInput(user.gender),
        address: user.address || null,
    }, { transaction });
};

const buildUserOutput = (userInstance) => {
    if (!userInstance) {
        return null;
    }

    const user = typeof userInstance.toJSON === "function" ? userInstance.toJSON() : userInstance;
    const patientProfile = user.patientProfile || null;
    const fullName = joinLegacyFullName(user, patientProfile);
    const nameParts = splitFullName(fullName);
    const gender = patientProfile?.gender ?? normalizeGenderInput(user.gender);

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone || null,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        isLocked: user.isLocked,
        lastLoginAt: user.lastLoginAt,
        avatar: user.avatar || null,
        createdAt: user.createdAt || null,
        updatedAt: user.updatedAt || null,

        fullName,
        firstName: user.firstName || nameParts.firstName,
        lastName: user.lastName || nameParts.lastName,
        address: patientProfile?.address ?? user.address ?? null,
        dateOfBirth: patientProfile?.dateOfBirth || null,
        birthDate: patientProfile?.dateOfBirth || null,
        profileGender: gender,
        gender: mapGenderToLegacyBoolean(gender),

        patientProfile: patientProfile ? {
            id: patientProfile.id,
            userId: patientProfile.userId,
            fullName: patientProfile.fullName,
            gender: patientProfile.gender,
            dateOfBirth: patientProfile.dateOfBirth,
            address: patientProfile.address,
            noShowCount: patientProfile.noShowCount,
            bookingLocked: patientProfile.bookingLocked,
            bookingLockedReason: patientProfile.bookingLockedReason,
            bookingLockedAt: patientProfile.bookingLockedAt,
        } : null,
    };
};

const getUserInclude = () => ([
    {
        model: db.PatientProfile,
        as: "patientProfile",
        required: false,
    },
]);

const createOrSyncPatientProfile = async (user, payload, transaction) => {
    if (!user || user.role !== ACTIVE_PATIENT_ROLE) {
        return null;
    }

    const patientProfile = await ensurePatientProfile(user, transaction);
    const currentFullName = payload.fullName ?? joinLegacyFullName(user, patientProfile);
    const normalizedGender = Object.prototype.hasOwnProperty.call(payload, "gender")
        ? normalizeGenderInput(payload.gender)
        : patientProfile.gender;
    const hasDateOfBirthField = Object.prototype.hasOwnProperty.call(payload, "dateOfBirth")
        || Object.prototype.hasOwnProperty.call(payload, "birthDate");
    const normalizedDob = hasDateOfBirthField
        ? normalizeDateInput(payload.dateOfBirth ?? payload.birthDate)
        : patientProfile.dateOfBirth;
    const normalizedAddress = Object.prototype.hasOwnProperty.call(payload, "address")
        ? (payload.address || null)
        : patientProfile.address;

    patientProfile.fullName = currentFullName;
    patientProfile.gender = normalizedGender;
    patientProfile.dateOfBirth = normalizedDob;
    patientProfile.address = normalizedAddress;
    await patientProfile.save({ transaction });

    return patientProfile;
};

const createNewUser = async (data) => {
    if (!data?.username || !data?.email || !data?.password) {
        throw new Error("Username, email và mật khẩu là bắt buộc");
    }

    const transaction = await db.sequelize.transaction();
    try {
        const role = data.role === "admin" ? "admin" : "user";
        const hashPasswordFromBcrypt = await hashUserPassword(data.password);
        const createdUser = await db.User.create({
            username: data.username.trim(),
            email: data.email.trim(),
            password: hashPasswordFromBcrypt,
            firstName: data.firstName || null,
            lastName: data.lastName || null,
            address: data.address || null,
            gender: mapGenderToLegacyBoolean(normalizeGenderInput(data.gender)),
            phone: data.phone || null,
            avatar: data.avatar || null,
            role,
            isActive: typeof data.isActive === "undefined" ? true : (data.isActive === true || data.isActive === "true" || data.isActive === "1"),
            isLocked: typeof data.isLocked === "undefined" ? false : (data.isLocked === true || data.isLocked === "true" || data.isLocked === "1"),
        }, { transaction });

        if (role === ACTIVE_PATIENT_ROLE) {
            const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || data.fullName || createdUser.username;
            await createOrSyncPatientProfile(createdUser, {
                fullName,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth ?? data.birthDate,
                address: data.address,
            }, transaction);
        }

        await transaction.commit();
        return "OK: Create new user successfully";
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getAllUsers = async () => {
    const users = await db.User.findAll({
        attributes: safeUserAttributes,
        include: getUserInclude(),
        order: [["id", "DESC"]],
    });

    return users.map(buildUserOutput);
};

const getAdminUsers = async (query = {}) => {
    const users = await getAllUsers();
    const keyword = String(query.search || "").trim().toLowerCase();

    const filtered = users.filter((user) => {
        const matchesKeyword = !keyword || [
            user.username,
            user.email,
            user.fullName,
            user.phone,
            user.role,
        ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));

        const matchesRole = !query.role || query.role === "all" || user.role === query.role;

        const matchesStatus = !query.status || query.status === "all" || (
            query.status === "active" ? user.isActive : !user.isActive
        );

        const matchesAccountLock = !query.accountLock || query.accountLock === "all" || (
            query.accountLock === "locked" ? user.isLocked : !user.isLocked
        );

        const bookingLocked = Boolean(user.patientProfile?.bookingLocked);
        const matchesBookingLock = !query.bookingLock || query.bookingLock === "all" || (
            query.bookingLock === "locked" ? bookingLocked : !bookingLocked
        );

        return matchesKeyword && matchesRole && matchesStatus && matchesAccountLock && matchesBookingLock;
    });

    const patientUsers = users.filter((user) => user.role === ACTIVE_PATIENT_ROLE);
    const staffUsers = users.filter((user) => user.role === "admin");

    return {
        items: filtered,
        total: filtered.length,
        stats: {
            totalUsers: users.length,
            totalPatients: patientUsers.length,
            totalAdmins: staffUsers.length,
            activeUsers: users.filter((user) => user.isActive).length,
            lockedUsers: users.filter((user) => user.isLocked).length,
            bookingLockedUsers: patientUsers.filter((user) => user.patientProfile?.bookingLocked).length,
            totalNoShows: patientUsers.reduce((sum, user) => sum + (user.patientProfile?.noShowCount || 0), 0),
        },
    };
};

const getUserInfoById = async (userId) => {
    const user = await db.User.findOne({
        where: { id: userId },
        attributes: safeUserAttributes,
        include: getUserInclude(),
    });

    return buildUserOutput(user);
};

const getUserRecordById = async (userId, transaction) => {
    const options = {
        where: { id: userId },
        include: getUserInclude(),
    };

    if (transaction) {
        options.transaction = transaction;
    }

    return db.User.findOne(options);
};

const getUserInfoByEmail = async (email) => {
    return db.User.findOne({
        where: { email },
        raw: true,
    });
};

const updateUserOTP = async (email, otp, expiresAt) => {
    const user = await db.User.findOne({
        where: { email },
    });

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    user.otpCode = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();
};

const updateUserPasswordAndVerify = async (email, newPassword) => {
    const user = await db.User.findOne({
        where: { email },
    });

    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    user.password = await hashUserPassword(newPassword);
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();
};

const updateUserData = async (data) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findOne({
            where: { id: data.id },
            transaction,
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        const nextFullName = data.fullName || [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || joinLegacyFullName(user, null);
        const splitName = splitFullName(nextFullName);

        if (data.username) user.username = data.username.trim();
        if (data.email) user.email = data.email.trim();
        if (typeof data.phone !== "undefined") user.phone = data.phone || null;
        if (typeof data.avatar !== "undefined") user.avatar = data.avatar || null;
        if (typeof data.isActive !== "undefined") user.isActive = data.isActive === true || data.isActive === "true" || data.isActive === "1";
        if (typeof data.isLocked !== "undefined") user.isLocked = data.isLocked === true || data.isLocked === "true" || data.isLocked === "1";
        if (data.role) user.role = data.role === "admin" ? "admin" : "user";
        if (typeof data.firstName !== "undefined" || typeof data.lastName !== "undefined" || typeof data.fullName !== "undefined") {
            user.firstName = splitName.firstName;
            user.lastName = splitName.lastName;
        }
        if (typeof data.address !== "undefined") user.address = data.address || null;
        if (typeof data.gender !== "undefined") user.gender = mapGenderToLegacyBoolean(normalizeGenderInput(data.gender));
        if (data.password) {
            user.password = await hashUserPassword(data.password);
        }

        await user.save({ transaction });

        if (user.role === ACTIVE_PATIENT_ROLE) {
            await createOrSyncPatientProfile(user, {
                fullName: nextFullName,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth ?? data.birthDate,
                address: data.address,
            }, transaction);
        }

        await transaction.commit();
        return getAllUsers();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateOwnProfile = async (userId, data) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findOne({
            where: { id: userId },
            transaction,
        });

        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        const fullName = data.fullName || [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || joinLegacyFullName(user, null);
        const splitName = splitFullName(fullName);

        if (data.username) user.username = data.username.trim();
        if (data.email) user.email = data.email.trim();
        if (typeof data.phone !== "undefined") user.phone = data.phone || null;
        if (typeof data.avatar !== "undefined") user.avatar = data.avatar || null;
        if (typeof data.firstName !== "undefined" || typeof data.lastName !== "undefined" || typeof data.fullName !== "undefined") {
            user.firstName = splitName.firstName;
            user.lastName = splitName.lastName;
        }
        if (typeof data.address !== "undefined") user.address = data.address || null;
        if (typeof data.gender !== "undefined") user.gender = mapGenderToLegacyBoolean(normalizeGenderInput(data.gender));
        if (data.password) {
            user.password = await hashUserPassword(data.password);
        }

        await user.save({ transaction });

        if (user.role === ACTIVE_PATIENT_ROLE) {
            await createOrSyncPatientProfile(user, {
                fullName,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth ?? data.birthDate,
                address: data.address,
            }, transaction);
        }

        await transaction.commit();
        return getUserInfoById(userId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deleteUserById = async (userId) => {
    const user = await db.User.findOne({
        where: { id: userId },
    });

    if (user) {
        await user.destroy();
    }
};

const toggleUserAccountLock = async (userId, forceState) => {
    const user = await db.User.findByPk(userId);
    if (!user) {
        throw new Error("Không tìm thấy người dùng");
    }

    user.isLocked = typeof forceState === "boolean" ? forceState : !user.isLocked;
    await user.save();

    return buildUserOutput(await getUserRecordById(user.id));
};

const toggleUserBookingLock = async (userId, payload = {}) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        if (user.role !== ACTIVE_PATIENT_ROLE) {
            throw new Error("Chỉ có thể khóa đặt lịch đối với tài khoản bệnh nhân");
        }

        const profile = await ensurePatientProfile(user, transaction);
        const nextLocked = typeof payload.locked === "boolean"
            ? payload.locked
            : !profile.bookingLocked;

        profile.bookingLocked = nextLocked;
        profile.bookingLockedReason = nextLocked
            ? (String(payload.reason || "").trim() || "Khóa đặt lịch bởi quản trị viên")
            : null;
        profile.bookingLockedAt = nextLocked ? new Date() : null;
        await profile.save({ transaction });

        await transaction.commit();
        return buildUserOutput(await getUserRecordById(user.id));
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const resetUserNoShow = async (userId) => {
    const transaction = await db.sequelize.transaction();
    try {
        const user = await db.User.findByPk(userId, { transaction });
        if (!user) {
            throw new Error("Không tìm thấy người dùng");
        }

        if (user.role !== ACTIVE_PATIENT_ROLE) {
            throw new Error("Chỉ có thể reset no-show đối với tài khoản bệnh nhân");
        }

        const profile = await ensurePatientProfile(user, transaction);
        profile.noShowCount = 0;
        await profile.save({ transaction });

        await transaction.commit();
        return buildUserOutput(await getUserRecordById(user.id));
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createNewUser,
    hashUserPassword,
    getAllUsers,
    getAdminUsers,
    getUserInfoById,
    getUserInfoByEmail,
    updateUserOTP,
    updateUserPasswordAndVerify,
    updateUserData,
    updateOwnProfile,
    deleteUserById,
    ensurePatientProfile,
    toggleUserAccountLock,
    toggleUserBookingLock,
    resetUserNoShow,
};

import db from "../models/index";

const normalizeDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error("Ngày sinh không hợp lệ");
    }
    return date.toISOString().slice(0, 10);
};

const normalizeGender = (value) => {
    if (!value) return null;
    const normalized = String(value).trim().toUpperCase();
    if (["MALE", "FEMALE", "OTHER"].includes(normalized)) {
        return normalized;
    }
    throw new Error("Giới tính không hợp lệ");
};

const mapOutput = (instance) => {
    const item = typeof instance?.toJSON === "function" ? instance.toJSON() : instance;
    return {
        id: item.id,
        fullName: item.fullName,
        relationship: item.relationship,
        phone: item.phone,
        gender: item.gender,
        dateOfBirth: item.dateOfBirth,
        note: item.note,
        isPrimary: item.isPrimary,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
    };
};

const listMyRelatives = async (userId) => {
    const items = await db.RelativeProfile.findAll({
        where: { userId },
        order: [["isPrimary", "DESC"], ["createdAt", "DESC"]],
    });
    return items.map(mapOutput);
};

const createRelative = async (userId, payload = {}) => {
    const fullName = String(payload.fullName || "").trim();
    const relationship = String(payload.relationship || "").trim();

    if (!fullName) {
        throw new Error("Họ tên người thân là bắt buộc");
    }

    if (!relationship) {
        throw new Error("Mối quan hệ là bắt buộc");
    }

    const isPrimary = payload.isPrimary === true || payload.isPrimary === "true";

    const transaction = await db.sequelize.transaction();
    try {
        if (isPrimary) {
            await db.RelativeProfile.update(
                { isPrimary: false },
                { where: { userId }, transaction },
            );
        }

        const item = await db.RelativeProfile.create({
            userId,
            fullName,
            relationship,
            phone: String(payload.phone || "").trim() || null,
            gender: normalizeGender(payload.gender),
            dateOfBirth: normalizeDate(payload.dateOfBirth),
            note: String(payload.note || "").trim() || null,
            isPrimary,
        }, { transaction });

        await transaction.commit();
        return mapOutput(item);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updateRelative = async (userId, relativeId, payload = {}) => {
    const transaction = await db.sequelize.transaction();
    try {
        const item = await db.RelativeProfile.findOne({
            where: { id: relativeId, userId },
            transaction,
        });
        if (!item) {
            const error = new Error("Không tìm thấy hồ sơ người thân");
            error.status = 404;
            throw error;
        }

        if (typeof payload.fullName !== "undefined") {
            const fullName = String(payload.fullName || "").trim();
            if (!fullName) {
                throw new Error("Họ tên người thân là bắt buộc");
            }
            item.fullName = fullName;
        }

        if (typeof payload.relationship !== "undefined") {
            const relationship = String(payload.relationship || "").trim();
            if (!relationship) {
                throw new Error("Mối quan hệ là bắt buộc");
            }
            item.relationship = relationship;
        }

        if (typeof payload.phone !== "undefined") {
            item.phone = String(payload.phone || "").trim() || null;
        }

        if (typeof payload.gender !== "undefined") {
            item.gender = normalizeGender(payload.gender);
        }

        if (typeof payload.dateOfBirth !== "undefined") {
            item.dateOfBirth = normalizeDate(payload.dateOfBirth);
        }

        if (typeof payload.note !== "undefined") {
            item.note = String(payload.note || "").trim() || null;
        }

        if (typeof payload.isPrimary !== "undefined") {
            const isPrimary = payload.isPrimary === true || payload.isPrimary === "true";
            if (isPrimary) {
                await db.RelativeProfile.update(
                    { isPrimary: false },
                    { where: { userId }, transaction },
                );
            }
            item.isPrimary = isPrimary;
        }

        await item.save({ transaction });
        await transaction.commit();
        return mapOutput(item);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deleteRelative = async (userId, relativeId) => {
    const item = await db.RelativeProfile.findOne({
        where: { id: relativeId, userId },
    });
    if (!item) {
        const error = new Error("Không tìm thấy hồ sơ người thân");
        error.status = 404;
        throw error;
    }
    await item.destroy();
    return true;
};

module.exports = {
    listMyRelatives,
    createRelative,
    updateRelative,
    deleteRelative,
};

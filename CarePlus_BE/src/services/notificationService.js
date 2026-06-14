import db from "../models/index";

const subscribers = new Map();

const mapNotification = (instance) => {
    const item = typeof instance?.toJSON === "function" ? instance.toJSON() : instance;
    return {
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type,
        link: item.link,
        isRead: item.isRead,
        readAt: item.readAt,
        createdAt: item.createdAt,
    };
};

const emitToUser = (userId, payload) => {
    const clients = subscribers.get(String(userId)) || [];
    clients.forEach((client) => {
        try {
            client.write(`data: ${JSON.stringify(payload)}\n\n`);
        } catch (error) {
            // Ignore broken connections; cleanup happens on close.
        }
    });
};

const subscribe = (userId, res) => {
    const key = String(userId);
    const current = subscribers.get(key) || [];
    current.push(res);
    subscribers.set(key, current);

    res.write(`data: ${JSON.stringify({ type: "connected", timestamp: new Date().toISOString() })}\n\n`);

    const cleanup = () => {
        const next = (subscribers.get(key) || []).filter((client) => client !== res);
        if (next.length > 0) {
            subscribers.set(key, next);
        } else {
            subscribers.delete(key);
        }
    };

    res.on("close", cleanup);
    res.on("finish", cleanup);
};

const listMyNotifications = async (userId) => {
    const items = await db.Notification.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
        limit: 20,
    });

    return {
        unreadCount: items.filter((item) => !item.isRead).length,
        items: items.map(mapNotification),
    };
};

const markAsRead = async (userId, notificationId) => {
    const notification = await db.Notification.findOne({
        where: { id: notificationId, userId },
    });
    if (!notification) {
        const error = new Error("Không tìm thấy thông báo");
        error.status = 404;
        throw error;
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
    return mapNotification(notification);
};

const markAllAsRead = async (userId) => {
    await db.Notification.update(
        { isRead: true, readAt: new Date() },
        { where: { userId, isRead: false } },
    );
    return true;
};

const createForUsers = async (userIds, payload = {}, options = {}) => {
    const dedupedUserIds = [...new Set((userIds || []).filter(Boolean).map((id) => Number(id)))];
    if (dedupedUserIds.length === 0) {
        return [];
    }

    const records = await db.Notification.bulkCreate(
        dedupedUserIds.map((userId) => ({
            userId,
            title: payload.title || "Thông báo mới",
            message: payload.message || "",
            type: payload.type || "system",
            link: payload.link || null,
            isRead: false,
        })),
        {
            transaction: options.transaction,
            returning: true,
        },
    );

    records.forEach((record) => {
        emitToUser(record.userId, {
            type: "notification",
            item: mapNotification(record),
        });
    });

    return records;
};

const notifyAdmins = async (payload = {}, options = {}) => {
    const admins = await db.User.findAll({
        where: { role: "admin", isActive: true, isLocked: false },
        attributes: ["id"],
        transaction: options.transaction,
    });
    return createForUsers(admins.map((item) => item.id), payload, options);
};

module.exports = {
    subscribe,
    listMyNotifications,
    markAsRead,
    markAllAsRead,
    createForUsers,
    notifyAdmins,
};

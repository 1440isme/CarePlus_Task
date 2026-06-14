import db from "../models/index";
import jwtUtils from "../utils/jwt";
import notificationService from "../services/notificationService";

const streamNotifications = async (req, res) => {
    try {
        const token = String(req.query.token || "").trim();
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Thiếu token cho kết nối realtime",
            });
        }

        const decoded = jwtUtils.verifyAccessToken(token);
        const user = await db.User.findOne({
            where: { id: decoded.id },
            attributes: ["id", "isActive", "isLocked"],
            raw: true,
        });

        if (!user || !user.isActive || user.isLocked) {
            return res.status(403).json({
                success: false,
                message: "Tài khoản không thể nhận thông báo realtime",
            });
        }

        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        });

        notificationService.subscribe(user.id, res);
        return undefined;
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token stream không hợp lệ hoặc đã hết hạn",
        });
    }
};

const getMyNotifications = async (req, res) => {
    try {
        const data = await notificationService.listMyNotifications(req.user.id);
        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Không thể tải danh sách thông báo",
        });
    }
};

const markNotificationRead = async (req, res) => {
    try {
        const item = await notificationService.markAsRead(req.user.id, req.params.id);
        return res.status(200).json({
            success: true,
            item,
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Không thể đánh dấu đã đọc",
        });
    }
};

const markAllNotificationsRead = async (req, res) => {
    try {
        await notificationService.markAllAsRead(req.user.id);
        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Không thể đánh dấu tất cả là đã đọc",
        });
    }
};

module.exports = {
    streamNotifications,
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
};

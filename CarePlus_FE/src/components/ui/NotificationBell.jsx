import { BellOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { getMyNotificationsApi, markAllNotificationsReadApi, markNotificationReadApi } from "../../util/api";

const NotificationBell = ({ compact = false }) => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const streamUrl = useMemo(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return null;
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        return `${baseUrl}/api/notifications/stream?token=${encodeURIComponent(token)}`;
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await getMyNotificationsApi();
            if (res.data?.success) {
                setNotifications(res.data.data?.items || []);
                setUnreadCount(res.data.data?.unreadCount || 0);
            }
        } catch (error) {
            // Ignore transient notification errors in UI chrome.
        }
    };

    useEffect(() => {
        void loadNotifications();
    }, []);

    useEffect(() => {
        if (!streamUrl) return undefined;

        const source = new EventSource(streamUrl);
        source.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                if (payload?.type === "notification" && payload.item) {
                    setNotifications((prev) => [payload.item, ...prev].slice(0, 20));
                    setUnreadCount((prev) => prev + 1);
                }
            } catch (error) {
                // Ignore malformed events.
            }
        };

        return () => {
            source.close();
        };
    }, [streamUrl]);

    const handleOpen = async () => {
        setOpen((prev) => !prev);
        if (!open && unreadCount > 0) {
            try {
                await markAllNotificationsReadApi();
                setUnreadCount(0);
                setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
            } catch (error) {
                // Ignore mark-all failures in chrome interaction.
            }
        }
    };

    const handleItemClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await markNotificationReadApi(notification.id);
                setNotifications((prev) => prev.map((item) => (
                    item.id === notification.id ? { ...item, isRead: true } : item
                )));
            } catch (error) {
                // Ignore.
            }
        }

        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={handleOpen}
                className={`relative flex items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 ${
                    compact ? "h-8 w-8" : "h-9 w-9"
                }`}
            >
                <BellOutlined className={compact ? "text-sm" : "text-base"} />
                {unreadCount > 0 ? (
                    <span className="absolute right-1.5 top-1.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                        {Math.min(unreadCount, 9)}
                    </span>
                ) : null}
            </button>

            {open ? (
                <div className="absolute right-0 z-20 mt-2 w-[320px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                    <div className="border-b border-slate-100 px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">Thông báo realtime</p>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto">
                        {notifications.length > 0 ? notifications.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleItemClick(item)}
                                className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                                    item.isRead ? "bg-white" : "bg-sky-50/60"
                                }`}
                            >
                                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{item.message}</p>
                                <p className="mt-2 text-[11px] text-slate-400">
                                    {new Date(item.createdAt).toLocaleString("vi-VN")}
                                </p>
                            </button>
                        )) : (
                            <div className="px-4 py-6 text-sm text-slate-500">
                                Chưa có thông báo nào.
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default NotificationBell;

import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import { getAdminDashboard } from "../util/api";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value) || 0);
const formatCurrency = (value) => new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
}).format(Number(value) || 0);

const STATUS_LABELS = {
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
    NO_SHOW: "Vắng mặt",
};

const STATUS_TONES = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    CONFIRMED: "bg-sky-50 text-sky-700 border-sky-100",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    CANCELLED: "bg-slate-100 text-slate-700 border-slate-200",
    NO_SHOW: "bg-rose-50 text-rose-700 border-rose-100",
};

const CARD_CONFIG = [
    { key: "bookings", title: "Lượt đặt lịch", tone: "bg-sky-400", helper: "Tổng lịch hẹn đã ghi nhận" },
    { key: "estimatedRevenue", title: "Doanh thu ước tính", tone: "bg-emerald-400", helper: "Từ lịch đã xác nhận hoặc hoàn tất", isCurrency: true },
    { key: "activeUsers", title: "Người dùng hoạt động", tone: "bg-cyan-400", helper: "Tài khoản đang được kích hoạt" },
    { key: "totalNoShows", title: "Lượt vắng mặt", tone: "bg-rose-400", helper: "Tích lũy trên hồ sơ bệnh nhân" },
    { key: "doctors", title: "Bác sĩ hoạt động", tone: "bg-indigo-400", helper: "Đang mở nhận lịch khám" },
    { key: "specialties", title: "Chuyên khoa mở", tone: "bg-violet-400", helper: "Hiển thị trên hệ thống" },
];

const buildChartPoints = (items = []) => {
    if (!items.length) return "";

    const width = 564;
    const height = 150;
    const paddingX = 18;
    const paddingTop = 16;
    const paddingBottom = 18;
    const innerWidth = width - paddingX * 2;
    const innerHeight = height - paddingTop - paddingBottom;
    const maxValue = Math.max(...items.map((item) => Number(item.value) || 0), 1);

    return items.map((item, index) => {
        const x = paddingX + (items.length === 1 ? innerWidth / 2 : (innerWidth / (items.length - 1)) * index);
        const y = paddingTop + innerHeight - ((Number(item.value) || 0) / maxValue) * innerHeight;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");
};

const AdminDashboardPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminDashboard();
            setDashboard(res.data?.data || null);
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể tải dữ liệu tổng quan.");
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const statMap = useMemo(() => {
        return (dashboard?.stats || []).reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});
    }, [dashboard]);

    const cards = useMemo(() => {
        return CARD_CONFIG.map((item) => ({
            ...item,
            value: item.key === "estimatedRevenue"
                ? dashboard?.highlights?.estimatedRevenue || 0
                : item.key === "activeUsers"
                    ? dashboard?.highlights?.activeUsers || 0
                    : item.key === "totalNoShows"
                        ? dashboard?.highlights?.totalNoShows || 0
                        : statMap[item.key] || 0,
        }));
    }, [dashboard, statMap]);

    const statusCards = useMemo(() => {
        const counts = dashboard?.highlights?.appointmentStatusCounts || {};
        return Object.entries(counts).map(([status, value]) => ({
            status,
            label: STATUS_LABELS[status] || status,
            value,
        }));
    }, [dashboard]);

    const chartPoints = useMemo(() => buildChartPoints(dashboard?.appointmentChart || []), [dashboard]);
    const chartAreaPoints = chartPoints ? `18,132 ${chartPoints} 546,132` : "";

    const todayLabel = useMemo(() => {
        return new Date().toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }, []);

    return (
        <>
            {contextHolder}
            <AdminLayout
                title="Trang chủ admin"
                activeKey="dashboard"
                actions={(
                    <button
                        className="inline-flex items-center gap-1 rounded bg-cyan-500 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-cyan-600"
                        onClick={() => loadDashboard()}
                        type="button"
                    >
                        <ReloadOutlined />
                        Làm mới
                    </button>
                )}
            >
                {loading ? (
                    <div className="flex min-h-[420px] items-center justify-center gap-2 text-xs text-slate-500">
                        <LoadingOutlined className="text-cyan-500" />
                        Đang tải dữ liệu...
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-[18px] font-semibold text-slate-800">Tổng quan hệ thống</h1>
                            <p className="mt-1 text-[10px] text-slate-400">Dữ liệu realtime cập nhật ngày {todayLabel}</p>
                        </div>

                        <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">
                            {cards.map((item) => (
                                <article key={item.key} className="rounded border border-slate-100 bg-white p-3">
                                    <div className={`mb-2 h-3 w-3 rounded-full ${item.tone}`} />
                                    <p className="text-[16px] font-semibold text-slate-800">
                                        {item.isCurrency ? formatCurrency(item.value) : formatNumber(item.value)}
                                    </p>
                                    <p className="mt-1 text-[10px] font-medium text-slate-600">{item.title}</p>
                                    <p className="mt-1 text-[10px] text-slate-400">{item.helper}</p>
                                </article>
                            ))}
                        </section>

                        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
                            <article className="rounded border border-slate-100 bg-white p-3">
                                <div className="flex items-center justify-between gap-3">
                                    <h2 className="text-[11px] font-semibold text-slate-700">Lượt đặt lịch 7 ngày gần nhất</h2>
                                    <span className="text-[10px] text-slate-400">Tổng {formatNumber(statMap.bookings)} lịch</span>
                                </div>
                                <div className="mt-3 h-[180px] rounded border border-slate-100 bg-[#fbfeff] p-2">
                                    {dashboard?.appointmentChart?.length ? (
                                        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 564 150">
                                            <line x1="18" y1="132" x2="546" y2="132" stroke="#e5e7eb" strokeWidth="1" />
                                            <line x1="18" y1="16" x2="18" y2="132" stroke="#e5e7eb" strokeWidth="1" />
                                            <polyline
                                                fill="rgba(14,165,233,0.08)"
                                                points={chartAreaPoints}
                                            />
                                            <polyline
                                                fill="none"
                                                points={chartPoints}
                                                stroke="#0ea5e9"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                                            Chưa có dữ liệu biểu đồ.
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 grid grid-cols-7 gap-2">
                                    {(dashboard?.appointmentChart || []).map((item) => (
                                        <div key={item.date} className="rounded bg-slate-50 px-2 py-2 text-center">
                                            <p className="text-[10px] font-medium text-slate-600">{item.label}</p>
                                            <p className="mt-1 text-[12px] font-semibold text-slate-800">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="rounded border border-slate-100 bg-white p-3">
                                <h2 className="mb-3 text-[11px] font-semibold text-slate-700">Trạng thái lịch hẹn</h2>
                                <div className="space-y-2">
                                    {statusCards.length ? statusCards.map((item) => (
                                        <div
                                            key={item.status}
                                            className={`rounded border px-3 py-2 ${STATUS_TONES[item.status] || "bg-slate-50 text-slate-700 border-slate-200"}`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-[10px] font-semibold">{item.label}</p>
                                                <span className="text-[12px] font-bold">{formatNumber(item.value)}</span>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="rounded border border-dashed border-slate-200 px-3 py-4 text-[11px] text-slate-400">
                                            Chưa có lịch hẹn nào để thống kê.
                                        </div>
                                    )}
                                </div>
                            </article>
                        </section>

                        <section className="grid gap-4 xl:grid-cols-3">
                            <article className="rounded border border-slate-100 bg-white p-3 xl:col-span-1">
                                <h2 className="mb-3 text-[11px] font-semibold text-slate-700">Top bác sĩ được đặt nhiều</h2>
                                <div className="space-y-2">
                                    {(dashboard?.recentDoctors || []).length ? dashboard.recentDoctors.map((doctor) => (
                                        <div key={doctor.id} className="rounded border border-slate-100 bg-slate-50 px-3 py-2">
                                            <p className="text-[11px] font-semibold text-slate-800">{doctor.fullName}</p>
                                            <p className="mt-1 text-[10px] text-slate-500">
                                                {doctor.specialtyName} • {doctor.consultationFeeLabel}
                                            </p>
                                            <p className="mt-1 text-[10px] text-cyan-600">{doctor.ratingLabel}</p>
                                        </div>
                                    )) : (
                                        <div className="rounded border border-dashed border-slate-200 px-3 py-4 text-[11px] text-slate-400">
                                            Chưa có dữ liệu bác sĩ nổi bật.
                                        </div>
                                    )}
                                </div>
                            </article>

                            <article className="rounded border border-slate-100 bg-white p-3 xl:col-span-1">
                                <h2 className="mb-3 text-[11px] font-semibold text-slate-700">Thông báo gần đây</h2>
                                <div className="space-y-2">
                                    {(dashboard?.recentNotifications || []).length ? dashboard.recentNotifications.map((item) => (
                                        <div key={item.id} className="rounded border border-slate-100 bg-white px-3 py-2">
                                            <p className="text-[11px] font-semibold text-slate-800">{item.title}</p>
                                            <p className="mt-1 text-[10px] leading-4 text-slate-500">{item.message}</p>
                                            <p className="mt-2 text-[9px] uppercase tracking-[0.08em] text-slate-400">
                                                {new Date(item.createdAt).toLocaleString("vi-VN")}
                                            </p>
                                        </div>
                                    )) : (
                                        <div className="rounded border border-dashed border-slate-200 px-3 py-4 text-[11px] text-slate-400">
                                            Chưa có thông báo hệ thống.
                                        </div>
                                    )}
                                </div>
                            </article>

                            <article className="rounded border border-slate-100 bg-white p-3 xl:col-span-1">
                                <h2 className="mb-3 text-[11px] font-semibold text-slate-700">Điểm cần theo dõi</h2>
                                <div className="space-y-2">
                                    <div className="rounded border border-amber-100 bg-amber-50 px-3 py-2">
                                        <p className="text-[10px] font-semibold text-amber-800">Tài khoản bị khóa đặt lịch</p>
                                        <p className="mt-1 text-[12px] font-bold text-slate-800">
                                            {formatNumber(dashboard?.highlights?.bookingLockedUsers || 0)}
                                        </p>
                                    </div>
                                    <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                                        <p className="text-[10px] font-semibold text-slate-700">Tài khoản bị khóa hệ thống</p>
                                        <p className="mt-1 text-[12px] font-bold text-slate-800">
                                            {formatNumber(dashboard?.highlights?.lockedUsers || 0)}
                                        </p>
                                    </div>
                                    <div className="rounded border border-cyan-100 bg-cyan-50 px-3 py-2">
                                        <p className="text-[10px] font-semibold text-cyan-800">Bác sĩ nổi bật</p>
                                        <p className="mt-1 text-[12px] font-bold text-slate-800">
                                            {formatNumber(dashboard?.highlights?.featuredDoctors || 0)}
                                        </p>
                                    </div>
                                    <div className="rounded border border-violet-100 bg-violet-50 px-3 py-2">
                                        <p className="text-[10px] font-semibold text-violet-800">Admin đang hoạt động</p>
                                        <p className="mt-1 text-[12px] font-bold text-slate-800">
                                            {formatNumber(dashboard?.highlights?.totalAdmins || 0)}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </section>
                    </div>
                )}
            </AdminLayout>
        </>
    );
};

export default AdminDashboardPage;

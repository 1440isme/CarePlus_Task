import { LoadingOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import { getAdminDashboard } from "../util/api";

const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(Number(value) || 0);

const CARD_STYLES = [
    { dot: "bg-sky-400", note: "Lịch khám mới" },
    { dot: "bg-amber-400", note: "Chờ xử lý" },
    { dot: "bg-emerald-400", note: "Hoàn thành" },
    { dot: "bg-rose-400", note: "No-show" },
    { dot: "bg-indigo-400", note: "Bác sĩ" },
    { dot: "bg-violet-400", note: "Chuyên khoa" },
];

const CHART_POINTS = ["6,88", "58,45", "108,60", "158,28", "208,74", "258,50", "308,64", "358,42", "408,52", "458,69", "508,80", "558,43"];

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadDashboard();
    }, [loadDashboard]);

    const cards = useMemo(() => {
        const base = dashboard?.stats || [];
        return [
            base[0]?.value || 0,
            dashboard?.highlights?.activeUsers || 0,
            dashboard?.highlights?.featuredDoctors || 0,
            dashboard?.highlights?.totalNoShows || 0,
            base[1]?.value || 0,
            base[0]?.value || 0,
        ];
    }, [dashboard]);

    const approvals = useMemo(() => {
        return [
            {
                title: "Thẻ CKH",
                subtitle: "Hồ sơ chuyên khoa mới cần rà soát hiển thị.",
                ok: "Duyệt",
                bad: "Từ chối",
            },
            {
                title: "Xử lý lịch hẹn",
                subtitle: dashboard?.recentDoctors?.[0]
                    ? `${dashboard.recentDoctors[0].fullName} đang có nhiều lượt đặt cần kiểm tra.`
                    : "Kiểm tra điều phối lịch khám trong ngày.",
                ok: "Duyệt",
                bad: "Từ chối",
            },
        ];
    }, [dashboard]);

    return (
        <>
            {contextHolder}
            <AdminLayout
                title="Trang chủ admin"
                activeKey="dashboard"
                actions={
                    <button
                        className="inline-flex items-center gap-1 rounded bg-cyan-500 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-cyan-600"
                        onClick={() => loadDashboard()}
                        type="button"
                    >
                        <ReloadOutlined />
                        Làm mới
                    </button>
                }
            >
                {loading ? (
                    <div className="flex min-h-[420px] items-center justify-center gap-2 text-xs text-slate-500">
                        <LoadingOutlined className="text-cyan-500" />
                        Đang tải dữ liệu...
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <h1 className="text-[18px] font-semibold text-slate-800">Tổng quan hệ thống</h1>
                            <p className="mt-1 text-[10px] text-slate-400">Ngày 10/6/2026</p>
                        </div>

                        <section className="grid grid-cols-2 gap-3 xl:grid-cols-6">
                            {cards.map((value, index) => (
                                <article key={`${index}-${value}`} className="rounded border border-slate-100 bg-white p-3">
                                    <div className={`mb-2 h-3 w-3 rounded-full ${CARD_STYLES[index].dot}`} />
                                    <p className="text-[18px] font-semibold text-slate-800">{formatNumber(value)}</p>
                                    <p className="mt-1 text-[10px] text-slate-400">{CARD_STYLES[index].note}</p>
                                </article>
                            ))}
                        </section>

                        <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px]">
                            <article className="rounded border border-slate-100 bg-white p-3">
                                <h2 className="mb-3 text-[11px] font-semibold text-slate-700">Lịch hẹn theo ngày (tháng 6/2026)</h2>
                                <div className="h-[180px] rounded border border-slate-100 bg-[#fbfeff] p-2">
                                    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 564 150">
                                        <line x1="12" y1="132" x2="552" y2="132" stroke="#e5e7eb" strokeWidth="1" />
                                        <line x1="12" y1="12" x2="12" y2="132" stroke="#e5e7eb" strokeWidth="1" />
                                        <polyline
                                            fill="rgba(14,165,233,0.08)"
                                            points={`12,132 ${CHART_POINTS.join(" ")} 558,132`}
                                        />
                                        <polyline
                                            fill="none"
                                            points={CHART_POINTS.join(" ")}
                                            stroke="#0ea5e9"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </article>

                            <article className="rounded border border-slate-100 bg-white p-3">
                                <h2 className="mb-3 text-[11px] font-semibold text-slate-700">Chờ duyệt (2)</h2>
                                <div className="space-y-2">
                                    {approvals.map((item) => (
                                        <div key={item.title} className="rounded border border-amber-100 bg-amber-50 p-2">
                                            <p className="text-[10px] font-semibold text-slate-700">{item.title}</p>
                                            <p className="mt-1 text-[9px] leading-4 text-slate-500">{item.subtitle}</p>
                                            <div className="mt-2 flex gap-1">
                                                <span className="rounded bg-emerald-500 px-1.5 py-0.5 text-[8px] text-white">{item.ok}</span>
                                                <span className="rounded bg-rose-500 px-1.5 py-0.5 text-[8px] text-white">{item.bad}</span>
                                            </div>
                                        </div>
                                    ))}
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

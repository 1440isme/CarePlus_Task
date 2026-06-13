import {
    CalendarOutlined,
    FileTextOutlined,
    HomeOutlined,
    LogoutOutlined,
    MailOutlined,
    MedicineBoxOutlined,
    PieChartOutlined,
    SettingOutlined,
    SolutionOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const PRIMARY_ITEMS = [
    { key: "dashboard", label: "Tổng quan", href: "/admin/dashboard", icon: PieChartOutlined },
    { key: "specialties", label: "Chuyên khoa", href: "/admin/specialties", icon: MedicineBoxOutlined },
    { key: "doctors", label: "Bác sĩ", href: "/admin/doctors", icon: TeamOutlined },
    { key: "schedule", label: "Lịch làm việc", icon: CalendarOutlined },
    { key: "appointments", label: "Lịch hẹn", icon: CalendarOutlined },
    { key: "approvals", label: "Duyệt yêu cầu", icon: SolutionOutlined },
    { key: "users", label: "Người dùng", href: "/admin/users", icon: UserOutlined },
    { key: "articles", label: "Bài viết", icon: FileTextOutlined },
    { key: "stats", label: "Thống kê", icon: PieChartOutlined },
    { key: "clinic", label: "Thông tin phòng khám", icon: MedicineBoxOutlined },
    { key: "settings", label: "Cài đặt hệ thống", icon: SettingOutlined },
    { key: "emails", label: "Email Preview", icon: MailOutlined },
];

const AdminLayout = ({ title, activeKey, actions, children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const displayName = useMemo(() => {
        const parts = [user?.firstName, user?.lastName].filter(Boolean);
        return parts.join(" ").trim() || user?.username || "Admin CarePlus";
    }, [user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-[#f7f7f4] px-4 py-5 text-slate-700 md:px-5">
            <p className="mb-2 text-[13px] text-slate-400">{title}</p>

            <div className="overflow-hidden rounded-sm border border-slate-100 bg-white">
                <div className="flex min-h-[760px]">
                    <aside className="flex w-[170px] shrink-0 flex-col border-r border-slate-100 bg-white">
                        <div className="border-b border-slate-100 px-3 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-4 w-4 items-center justify-center rounded bg-cyan-500 text-[9px] text-white">
                                    <MedicineBoxOutlined />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-700">CarePlus</span>
                            </div>
                        </div>

                        <div className="border-b border-slate-100 px-3 py-3">
                            <div className="rounded-md bg-cyan-50 px-2 py-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[8px] text-white">
                                        A
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[10px] font-semibold text-slate-700">{displayName}</p>
                                        <p className="text-[9px] text-cyan-600">Quản trị viên</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-2 py-3">
                            <ul className="space-y-1">
                                {PRIMARY_ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeKey === item.key;
                                    const content = (
                                        <>
                                            <Icon className="text-[10px]" />
                                            <span className="truncate">{item.label}</span>
                                        </>
                                    );

                                    if (item.href) {
                                        return (
                                            <li key={item.key}>
                                                <Link
                                                    className={`flex items-center gap-2 rounded px-2 py-1.5 text-[10px] transition ${
                                                        isActive
                                                            ? "bg-cyan-500 text-white"
                                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                                    }`}
                                                    to={item.href}
                                                >
                                                    {content}
                                                </Link>
                                            </li>
                                        );
                                    }

                                    return (
                                        <li key={item.key}>
                                            <div
                                                className={`flex items-center gap-2 rounded px-2 py-1.5 text-[10px] ${
                                                    isActive ? "bg-cyan-500 text-white" : "text-slate-400"
                                                }`}
                                            >
                                                {content}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="border-t border-slate-100 px-2 py-3">
                            <Link
                                className="mb-1 flex items-center gap-2 rounded px-2 py-1.5 text-[10px] text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                                to="/"
                            >
                                <HomeOutlined className="text-[10px]" />
                                <span>Về trang chủ</span>
                            </Link>
                            <button
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[10px] text-rose-500 transition hover:bg-rose-50"
                                onClick={handleLogout}
                                type="button"
                            >
                                <LogoutOutlined className="text-[10px]" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </aside>

                    <section className="flex min-w-0 flex-1 flex-col">
                        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-4 w-4 items-center justify-center rounded bg-cyan-500 text-[9px] text-white">
                                    <MedicineBoxOutlined />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-700">CarePlus</span>
                            </div>

                            <button
                                className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 transition hover:text-slate-700"
                                onClick={handleLogout}
                                type="button"
                            >
                                <LogoutOutlined className="text-[10px]" />
                                <span>Đăng xuất</span>
                            </button>
                        </header>

                        <main className="flex-1 px-4 py-4">
                            {actions ? <div className="mb-3 flex justify-end">{actions}</div> : null}
                            {children}
                        </main>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

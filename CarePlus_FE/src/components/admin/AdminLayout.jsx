import { BellOutlined, HomeOutlined, LogoutOutlined, MedicineBoxOutlined, PieChartOutlined, TeamOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const NAV_ITEMS = [
    { key: "dashboard", label: "Tổng quan", href: "/admin/dashboard", icon: PieChartOutlined },
    { key: "specialties", label: "Chuyên khoa", href: "/admin/specialties", icon: MedicineBoxOutlined },
    { key: "doctors", label: "Bác sĩ", href: "/admin/doctors", icon: TeamOutlined },
    { key: "users", label: "Người dùng", href: "/admin/users", icon: TeamOutlined },
];

const AdminLayout = ({ title, description, activeKey, actions, children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const displayName = useMemo(() => {
        const parts = [user?.firstName, user?.lastName].filter(Boolean);
        return parts.join(" ").trim() || user?.username || "Quản trị viên";
    }, [user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto flex min-h-screen max-w-[1580px] bg-white">
                <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <Link className="flex items-center gap-3" to="/admin/dashboard">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-sm">
                                <MedicineBoxOutlined />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">CarePlus</p>
                                <p className="text-xs text-slate-500">Bảng quản trị</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 px-3 py-4">
                        <nav className="space-y-1.5">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeKey === item.key || location.pathname === item.href;

                                return (
                                    <Link
                                        key={item.key}
                                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                                            isActive
                                                ? "bg-cyan-600 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
                                        }`}
                                        to={item.href}
                                    >
                                        <Icon className="text-sm" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="border-t border-slate-100 px-3 py-4">
                        <Link
                            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100"
                            to="/"
                        >
                            <HomeOutlined />
                            <span>Về trang chủ</span>
                        </Link>
                        <button
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition hover:bg-rose-50"
                            onClick={handleLogout}
                            type="button"
                        >
                            <LogoutOutlined />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </aside>

                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Khu vực quản trị CarePlus</p>
                            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                            {description ? <p className="mt-2 max-w-3xl text-sm text-slate-500">{description}</p> : null}
                        </div>

                        <div className="flex items-center gap-5">
                            <button
                                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                                type="button"
                            >
                                <BellOutlined />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
                            </button>

                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{user?.role || "admin"}</p>
                            </div>

                            <button
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                onClick={handleLogout}
                                type="button"
                            >
                                <LogoutOutlined />
                                Đăng xuất
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 overflow-x-hidden bg-slate-50 px-6 py-6">
                        {actions ? <div className="mb-5 flex items-center justify-end gap-3">{actions}</div> : null}
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;

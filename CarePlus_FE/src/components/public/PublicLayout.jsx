import { HeartFilled, LogoutOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const navigationItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Chuyên khoa", href: "/specialties" },
    { label: "Bác sĩ", href: "/doctors" },
    { label: "Cẩm nang", href: "/articles" },
    { label: "Liên hệ", href: "#footer" },
];

const isNavActive = (pathname, href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
};

const PublicLayout = ({ children, clinicInfo, compact = false }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    const profileUrl = user?.role === "admin" ? "/admin/dashboard" : "/user/profile";

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700">
            <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
                <div className="mx-auto flex h-[60px] w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0092b8] text-white">
                            <HeartFilled />
                        </span>
                        <span className="text-[24px] font-semibold text-slate-950">
                            Care<span className="text-[#0092b8]">Plus</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 lg:flex">
                        {navigationItems.map((item) => (
                            item.href.startsWith("#") ? (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="rounded-xl px-3 py-2 text-[14px] text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link
                                    key={item.label}
                                    to={item.href}
                                    className={`rounded-xl px-3 py-2 text-[14px] transition ${
                                        isNavActive(location.pathname, item.href)
                                            ? "bg-sky-50 font-semibold text-[#0092b8]"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        ))}
                    </nav>

                    <div className="hidden items-center gap-3 lg:flex">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <PhoneOutlined className="text-[#0092b8]" />
                            <span>{clinicInfo?.phone || "1900 1234"}</span>
                        </div>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={profileUrl}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    <UserOutlined />
                                    <span>{user?.firstName || user?.username || "Tài khoản"}</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#0092b8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#007da0]"
                                >
                                    <LogoutOutlined />
                                    <span>Đăng xuất</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-xl bg-[#0092b8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#007da0]"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className={compact ? "pb-16" : ""}>{children}</main>

            <footer id="footer" className="border-t border-slate-100 bg-white">
                <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0092b8] text-white">
                                <HeartFilled />
                            </span>
                            <span className="text-2xl font-semibold text-slate-950">{clinicInfo?.name || "CarePlus Clinic"}</span>
                        </div>
                        <p className="mt-4 text-[15px] leading-7 text-slate-500">
                            Phòng khám đa khoa CarePlus giúp bệnh nhân chủ động hơn trong việc tìm bác sĩ, chuyên khoa và đặt lịch khám trực tuyến.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-950">Liên kết nhanh</h3>
                        <div className="mt-4 space-y-3 text-sm text-slate-500">
                            <Link to="/" className="block transition hover:text-[#0092b8]">Trang chủ</Link>
                            <Link to="/specialties" className="block transition hover:text-[#0092b8]">Chuyên khoa</Link>
                            <Link to="/doctors" className="block transition hover:text-[#0092b8]">Bác sĩ</Link>
                            <Link to="/articles" className="block transition hover:text-[#0092b8]">Cẩm nang</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-950">Thông tin phòng khám</h3>
                        <div className="mt-4 space-y-3 text-sm text-slate-500">
                            <p>{clinicInfo?.address}</p>
                            <p>{clinicInfo?.phone}</p>
                            <p>{clinicInfo?.email}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-slate-950">Giờ làm việc</h3>
                        <div className="mt-4 space-y-2 text-sm text-slate-500">
                            {(clinicInfo?.workingHours || []).map((item) => (
                                <p key={item}>{item}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100">
                    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                        <p>© 2026 CarePlus Clinic. Bảo lưu mọi quyền.</p>
                        <div className="flex gap-5">
                            <span>Chính sách bảo mật</span>
                            <span>Điều khoản sử dụng</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;

import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { UserOutlined, LogoutOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const getDisplayName = () => {
        if (!user) return "";
        const full = [user.firstName, user.lastName].filter(Boolean).join(" ");
        return full || user.username || "";
    };

    const getProfileRoute = () => {
    return user?.role === "admin" ? "/admin/dashboard" : "/user/profile";
    };

    return (
        <header className="sticky top-0 z-40 border-b border-white/50 bg-white/80 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-2xl font-semibold tracking-tight text-slate-950">
                    <span>Care</span>
                    <span className="text-sky-600">Plus</span>
                </Link>

                <nav className="hidden items-center gap-2 md:flex">
                    <Link to="/" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">Trang chủ</Link>
                    {isAuthenticated && (
                        <Link to={getProfileRoute()} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">Hồ sơ</Link>
                    )}
                    {isAuthenticated && user?.role === "admin" && (
                        <Link to="/admin/users" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">Người dùng</Link>
                    )}
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to={getProfileRoute()}
                                className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300 hover:shadow"
                                id="header-user-profile"
                            >
                                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-500">
                                    {user?.avatar
                                        ? <img src={user.avatar} alt="avatar" />
                                        : <UserOutlined />
                                    }
                                </span>
                                <span className="hidden max-w-32 truncate text-sm font-medium text-slate-800 sm:block">{getDisplayName()}</span>
                            </Link>
                            <button
                                id="btn-logout"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                                onClick={handleLogout}
                            >
                                <LogoutOutlined /> Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="hidden items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex">
                                <UserAddOutlined /> Đăng ký
                            </Link>
                            <Link to="/login" id="btn-login-nav" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                                <LoginOutlined /> Đăng nhập
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

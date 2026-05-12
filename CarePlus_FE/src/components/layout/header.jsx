import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";

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

    return (
        <header className="app-header">
            <div className="app-header__inner">
                {/* Logo */}
                <Link to="/" className="app-header__logo">
                    <span className="logo-care">Care</span>
                    <span className="logo-plus">Plus</span>
                </Link>

                {/* Nav */}
                <nav className="app-header__nav">
                    <Link to="/" className="nav-link">Trang chủ</Link>
                    {isAuthenticated && (
                        <Link to="/user/profile" className="nav-link">Hồ sơ</Link>
                    )}
                </nav>

                {/* Auth actions */}
                <div className="app-header__actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/user/profile" className="header-user" id="header-user-profile">
                                <span className="header-user__avatar">
                                    {user?.avatar
                                        ? <img src={user.avatar} alt="avatar" />
                                        : <UserOutlined />
                                    }
                                </span>
                                <span className="header-user__name">{getDisplayName()}</span>
                            </Link>
                            <button
                                id="btn-logout"
                                className="btn btn--ghost btn--sm"
                                onClick={handleLogout}
                            >
                                <LogoutOutlined /> Đăng xuất
                            </button>
                        </>
                    ) : (
                        <Link to="/login" id="btn-login-nav" className="btn btn--primary btn--sm">
                            <LoginOutlined /> Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

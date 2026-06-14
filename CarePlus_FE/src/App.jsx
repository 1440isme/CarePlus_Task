import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { fetchCurrentUser } from "./store/slices/authSlice";
import Header from "./components/layout/header";
import HomePage from "./pages/home";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import ForgotPasswordPage from "./pages/forgotPassword";
import SpecialtiesPage from "./pages/specialties";
import SpecialtyDetailPage from "./pages/specialtyDetail";
import DoctorsPage from "./pages/doctors";
import DoctorDetailPage from "./pages/doctorDetail";
import ArticlesPage from "./pages/articles";
import ArticleDetailPage from "./pages/articleDetail";
import AdminDashboardPage from "./pages/adminDashboard";
import AdminSpecialtiesPage from "./pages/adminSpecialties";
import AdminDoctorsPage from "./pages/adminDoctors";
import AdminUsersPage from "./pages/adminUsers";
import UserProfilePage from "./pages/user";

const getProfileRouteByRole = (role) => {
    return role === "admin" ? "/admin/dashboard" : "/user/profile";
};

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <LoadingOutlined className="text-3xl text-slate-700" />
                <span className="text-sm font-medium">Đang tải...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (roles?.length && !roles.includes(user?.role)) {
        return <Navigate to={getProfileRouteByRole(user?.role)} replace />;
    }

    return children;
};

const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
                <LoadingOutlined className="text-3xl text-slate-700" />
                <span className="text-sm font-medium">Đang tải...</span>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={getProfileRouteByRole(user?.role)} replace />;
    }

    return children;
};

const AppRoutes = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const authRoutes = ["/login", "/register", "/forgot-password"];
    const publicRoutes = ["/", "/specialties", "/doctors", "/articles"];
    const dashboardRoutes = ["/user/profile", "/admin"];
    const isPublicRoute = publicRoutes.some((route) => location.pathname === route || location.pathname.startsWith(`${route}/`));
    const isDashboardRoute = dashboardRoutes.some((route) => location.pathname === route || location.pathname.startsWith(`${route}/`));
    const isAuthRoute = authRoutes.includes(location.pathname);
    const isFullScreenRoute = isAuthRoute || isDashboardRoute || isPublicRoute;
    const hideHeader = isFullScreenRoute;

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <div className="app-wrapper">
            {!hideHeader ? <Header /> : null}
            <main className={isFullScreenRoute ? "w-full flex-1" : "mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"}>
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    <Route path="/specialties" element={<SpecialtiesPage />} />
                    <Route path="/specialties/:slugOrId" element={<SpecialtyDetailPage />} />
                    <Route path="/doctors" element={<DoctorsPage />} />
                    <Route path="/doctors/:slugOrId" element={<DoctorDetailPage />} />
                    <Route path="/articles" element={<ArticlesPage />} />
                    <Route path="/articles/:slugOrId" element={<ArticleDetailPage />} />

                    <Route
                        path="/login"
                        element={
                            <PublicOnlyRoute>
                                <LoginPage />
                            </PublicOnlyRoute>
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <PublicOnlyRoute>
                                <RegisterPage />
                            </PublicOnlyRoute>
                        }
                    />

                    <Route
                        path="/forgot-password"
                        element={
                            <PublicOnlyRoute>
                                <ForgotPasswordPage />
                            </PublicOnlyRoute>
                        }
                    />

                    <Route
                        path="/user/profile"
                        element={
                            <ProtectedRoute roles={["user"]}>
                                <UserProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/profile"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <UserProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <AdminDashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/specialties"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <AdminSpecialtiesPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/doctors"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <AdminDoctorsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute roles={["admin"]}>
                                <AdminUsersPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;

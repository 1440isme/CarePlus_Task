import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authSlice";
import Header from "./components/layout/header";
import UserProfilePage from "./pages/user";

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    if (loading) {
        return (
            <div className="app-loading">
                <div className="app-loading__spinner" />
                <span>Đang tải...</span>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ─── App Routes ───────────────────────────────────────────────────────────────
const AppRoutes = () => {
    const dispatch = useDispatch();

    // Restore session khi app khởi động
    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <div className="app-wrapper">
            <Header />
            <main className="app-content">
                <Routes>
                    {/* Trang chủ tạm thời */}
                    <Route
                        path="/"
                        element={
                            <div className="placeholder-page">
                                <h1>Chào mừng đến CarePlus</h1>
                                <p>Ứng dụng quản lý sức khỏe của bạn</p>
                            </div>
                        }
                    />

                    {/* Trang Login tạm thời */}
                    <Route
                        path="/login"
                        element={
                            <div className="placeholder-page">
                                <h1>Đăng nhập</h1>
                                <p>Trang đăng nhập đang được xây dựng...</p>
                                <p className="muted" style={{ marginTop: 20 }}>
                                    Mẹo: Bạn có thể set `access_token` vào localStorage qua DevTools để test Profile.
                                </p>
                            </div>
                        }
                    />

                    {/* Edit Profile — cần đăng nhập */}
                    <Route
                        path="/user/profile"
                        element={
                            <ProtectedRoute>
                                <UserProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

// ─── Root App ─────────────────────────────────────────────────────────────────
// Provider đã được setup ở main.jsx, App chỉ cần setup routing
function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { message } from "antd";
import { LoadingOutlined, LockOutlined, MailOutlined, RightOutlined } from "@ant-design/icons";
import { loginSuccess } from "../store/slices/authSlice";
import { loginApi } from "../util/api";
import AuthLayout from "../components/ui/AuthLayout";
import AuthCard from "../components/ui/AuthCard";
import FormField from "../components/ui/FormField";
import PasswordField from "../components/ui/PasswordField";
import SubmitButton from "../components/ui/SubmitButton";

const initialForm = {
    login: "",
    password: "",
};

const getProfileRouteByRole = (role) => {
    return role === "admin" ? "/admin/dashboard" : "/user/profile";
};

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const isEmailLogin = useMemo(() => form.login.includes("@"), [form.login]);

    const validateForm = () => {
        const nextErrors = {};
        const normalizedLogin = form.login.trim();
        const normalizedPassword = form.password;

        if (!normalizedLogin) {
            nextErrors.login = "Vui lòng nhập username hoặc email.";
        } else if (normalizedLogin.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedLogin)) {
            nextErrors.login = "Email đăng nhập không đúng định dạng.";
        }

        if (!normalizedPassword) {
            nextErrors.password = "Vui lòng nhập mật khẩu.";
        } else if (normalizedPassword.length < 6) {
            nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setServerError("");

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setServerError("");

        try {
            const payload = {
                login: form.login.trim(),
                password: form.password,
            };
            const response = await loginApi(payload);
            const data = response.data || {};
            const user = data.user || null;
            const redirectUrl = data.redirectUrl || getProfileRouteByRole(user?.role);

            if (!data.success || !data.token || !user) {
                throw new Error("Phản hồi đăng nhập không hợp lệ.");
            }

            dispatch(loginSuccess({ token: data.token, user }));
            messageApi.success(data.message || "Đăng nhập thành công.");
            navigate(redirectUrl, { replace: true });
        } catch (error) {
            const statusCode = error.response?.status;
            const nextMessage = error.response?.data?.message || error.message || "Đăng nhập thất bại.";
            setServerError(nextMessage);

            if (statusCode === 429) {
                messageApi.warning("Bạn đã vượt quá giới hạn thử đăng nhập. Vui lòng chờ rồi thử lại.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}
            <AuthLayout
                title="Đăng nhập"
                description="Chào mừng bạn trở lại CarePlus Clinic"
            >
                <AuthCard
                    footer={(
                        <p>
                            Chưa có tài khoản?{" "}
                            <Link to="/register" className="font-medium text-[#0092b8] hover:text-[#007fa0]">
                                Đăng ký ngay
                            </Link>
                        </p>
                    )}
                >
                    {serverError ? (
                        <div className="rounded-[13px] border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
                            {serverError}
                        </div>
                    ) : null}

                    <form className={`space-y-[15px] ${serverError ? "mt-[15px]" : ""}`} onSubmit={handleSubmit} noValidate>
                        <FormField
                            id="login"
                            name="login"
                            label="Email"
                            value={form.login}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            autoComplete="username"
                            error={errors.login}
                            hint={!errors.login && form.login ? (isEmailLogin ? "Đang đăng nhập bằng email." : "Hệ thống vẫn chấp nhận username ở trường này.") : ""}
                            icon={<MailOutlined />}
                        />

                        <PasswordField
                            id="password"
                            name="password"
                            label="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            autoComplete="current-password"
                            error={errors.password}
                            icon={<LockOutlined />}
                            labelAction={(
                                <Link to="/forgot-password" className="text-[11px] font-normal text-[#0092b8] hover:text-[#007fa0]">
                                    Quên mật khẩu?
                                </Link>
                            )}
                        />

                        <div className="pt-[15px]">
                            <SubmitButton
                                loading={submitting}
                                disabled={submitting}
                                icon={submitting ? <LoadingOutlined /> : <RightOutlined className="text-[13px]" />}
                            >
                                {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
                            </SubmitButton>
                        </div>
                    </form>
                </AuthCard>
            </AuthLayout>
        </>
    );
};

export default LoginPage;

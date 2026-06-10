import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { LoadingOutlined, MailOutlined, SafetyCertificateOutlined, LockOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { forgotPasswordApi, resetPasswordApi } from "../util/api";
import AuthLayout from "../components/ui/AuthLayout";
import AuthCard from "../components/ui/AuthCard";
import FormField from "../components/ui/FormField";
import PasswordField from "../components/ui/PasswordField";
import SubmitButton from "../components/ui/SubmitButton";

const initialForm = {
    email: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
};

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [step, setStep] = useState(1);

    const validateStep1 = () => {
        const nextErrors = {};
        const normalizedEmail = form.email.trim();

        if (!normalizedEmail) {
            nextErrors.email = "Vui lòng nhập email.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            nextErrors.email = "Email không đúng định dạng.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const validateStep2 = () => {
        const nextErrors = {};

        if (!form.otpCode.trim()) {
            nextErrors.otpCode = "Vui lòng nhập mã OTP.";
        } else if (!/^\d{5}$/.test(form.otpCode.trim())) {
            nextErrors.otpCode = "Mã OTP phải gồm 5 chữ số.";
        }

        if (!form.newPassword) {
            nextErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
        } else if (form.newPassword.length < 6) {
            nextErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự.";
        }

        if (!form.confirmPassword) {
            nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
        } else if (form.newPassword !== form.confirmPassword) {
            nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
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

    const handleSendOTP = async (event) => {
        event.preventDefault();

        if (!validateStep1()) {
            return;
        }

        setSubmitting(true);
        setServerError("");

        try {
            const response = await forgotPasswordApi({ email: form.email.trim() });
            const data = response.data || {};

            if (!data.success) {
                throw new Error("Không thể gửi mã xác thực.");
            }

            messageApi.success(data.message || "Mã OTP đã được gửi đến email.");
            setStep(2);
        } catch (error) {
            const nextMessage = error.response?.data?.message || error.message || "Gửi mã xác thực thất bại.";
            setServerError(nextMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (!validateStep2()) {
            return;
        }

        setSubmitting(true);
        setServerError("");

        try {
            const payload = {
                email: form.email.trim(),
                otpCode: form.otpCode.trim(),
                newPassword: form.newPassword,
            };
            const response = await resetPasswordApi(payload);
            const data = response.data || {};

            if (!data.success) {
                throw new Error("Không thể khôi phục mật khẩu.");
            }

            messageApi.success(data.message || "Khôi phục mật khẩu thành công!");
            navigate("/login", { replace: true });
        } catch (error) {
            const nextMessage = error.response?.data?.message || error.message || "Khôi phục mật khẩu thất bại.";
            setServerError(nextMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}
            <AuthLayout
                title="Quên mật khẩu"
                description="Nhập email để đặt lại mật khẩu tài khoản"
            >
                <AuthCard
                    footer={(
                        <p>
                            <Link to="/login" className="font-medium text-slate-500 hover:text-[#0092b8]">
                                Quay về đăng nhập
                            </Link>
                        </p>
                    )}
                >
                    {serverError ? (
                        <div className="mb-[15px] rounded-[13px] border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
                            {serverError}
                        </div>
                    ) : null}

                    {step === 1 ? (
                        <form className="space-y-[15px]" onSubmit={handleSendOTP} noValidate>
                            <FormField
                                id="email"
                                name="email"
                                label="Email đăng ký"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                                autoComplete="email"
                                error={errors.email}
                                icon={<MailOutlined />}
                            />

                            <SubmitButton
                                loading={submitting}
                                disabled={submitting}
                                icon={submitting ? <LoadingOutlined /> : <CheckCircleOutlined className="text-[13px]" />}
                            >
                                {submitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                            </SubmitButton>
                        </form>
                    ) : (
                        <form className="space-y-[15px]" onSubmit={handleResetPassword} noValidate>
                            <FormField
                                id="otpCode"
                                name="otpCode"
                                label="Mã OTP"
                                value={form.otpCode}
                                onChange={handleChange}
                                placeholder="Nhập mã OTP 5 số"
                                maxLength={5}
                                error={errors.otpCode}
                                icon={<SafetyCertificateOutlined />}
                            />

                            <PasswordField
                                id="newPassword"
                                name="newPassword"
                                label="Mật khẩu mới"
                                value={form.newPassword}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu mới"
                                error={errors.newPassword}
                                icon={<LockOutlined />}
                            />

                            <PasswordField
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Xác nhận mật khẩu mới"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Nhập lại mật khẩu mới"
                                error={errors.confirmPassword}
                                icon={<LockOutlined />}
                            />

                            <div className="flex flex-col gap-3">
                                <SubmitButton
                                    loading={submitting}
                                    disabled={submitting}
                                    icon={submitting ? <LoadingOutlined /> : <CheckCircleOutlined className="text-[13px]" />}
                                >
                                    {submitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                                </SubmitButton>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-center text-[12px] font-medium text-slate-500 hover:text-[#0092b8]"
                                >
                                    Quay lại bước nhập email
                                </button>
                            </div>
                        </form>
                    )}
                </AuthCard>
            </AuthLayout>
        </>
    );
};

export default ForgotPasswordPage;

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import {
    LoadingOutlined,
    LockOutlined,
    MailOutlined,
    SafetyCertificateOutlined,
    SendOutlined,
    UserAddOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { registerApi, sendVerificationCodeApi } from "../util/api";
import AuthLayout from "../components/ui/AuthLayout";
import AuthCard from "../components/ui/AuthCard";
import FormField from "../components/ui/FormField";
import PasswordField from "../components/ui/PasswordField";
import SubmitButton from "../components/ui/SubmitButton";

const MIN_PASSWORD_LENGTH = 6;
const VERIFICATION_CODE_LENGTH = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_COOLDOWN_SECONDS = 60;

const initialForm = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
};

const RegisterPage = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [serverSuccess, setServerSuccess] = useState("");
    const [sendingCode, setSendingCode] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [verificationRequested, setVerificationRequested] = useState(false);

    useEffect(() => {
        if (!cooldown) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [cooldown]);

    const lockedRegistrationFields = verificationRequested;
    const canResendCode = cooldown === 0 && !sendingCode;
    const verificationHint = useMemo(() => {
        if (!verificationRequested) {
            return "Nhập thông tin rồi bấm Gửi mã để nhận OTP xác thực email.";
        }
        if (cooldown > 0) {
            return `Bạn có thể gửi lại mã sau ${cooldown}s.`;
        }
        return "Không thấy email? Bạn có thể gửi lại mã xác thực.";
    }, [cooldown, verificationRequested]);

    const validateForm = ({ requireVerificationCode = true } = {}) => {
        const nextErrors = {};
        const username = form.username.trim();
        const email = form.email.trim();
        const password = form.password;
        const confirmPassword = form.confirmPassword;
        const verificationCode = form.verificationCode.trim();

        if (!username) {
            nextErrors.username = "Vui lòng nhập tên đăng nhập.";
        }

        if (!email) {
            nextErrors.email = "Vui lòng nhập email.";
        } else if (!EMAIL_REGEX.test(email)) {
            nextErrors.email = "Email không đúng định dạng.";
        }

        if (!password) {
            nextErrors.password = "Vui lòng nhập mật khẩu.";
        } else if (password.length < MIN_PASSWORD_LENGTH) {
            nextErrors.password = `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự.`;
        }

        if (!confirmPassword) {
            nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
        } else if (confirmPassword !== password) {
            nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }

        if (requireVerificationCode) {
            if (!verificationCode) {
                nextErrors.verificationCode = "Vui lòng nhập mã xác thực.";
            } else if (!new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`).test(verificationCode)) {
                nextErrors.verificationCode = `Mã xác thực phải gồm ${VERIFICATION_CODE_LENGTH} chữ số.`;
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (lockedRegistrationFields && ["username", "email", "password", "confirmPassword"].includes(name)) {
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
        setServerError("");
        setServerSuccess("");

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSendCode = async () => {
        if (!validateForm({ requireVerificationCode: false })) {
            return;
        }

        setSendingCode(true);
        setServerError("");
        setServerSuccess("");

        try {
            const payload = {
                username: form.username.trim(),
                email: form.email.trim(),
            };
            const response = await sendVerificationCodeApi(payload);
            const data = response.data || {};

            if (!data.success) {
                throw new Error(data.message || "Không gửi được mã xác thực.");
            }

            setVerificationRequested(true);
            setCooldown(CODE_COOLDOWN_SECONDS);
            setServerSuccess(data.message || "Mã xác thực đã được gửi tới email của bạn.");
            messageApi.success(data.message || "Mã xác thực đã được gửi.");
        } catch (error) {
            const nextMessage = error.response?.data?.message || error.message || "Không gửi được mã xác thực.";
            setServerError(nextMessage);
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setServerError("");
        setServerSuccess("");

        try {
            const payload = {
                username: form.username.trim(),
                email: form.email.trim(),
                password: form.password,
                verificationCode: form.verificationCode.trim(),
            };
            const response = await registerApi(payload);
            const data = response.data || {};

            if (!data.success) {
                throw new Error(data.message || "Đăng ký thất bại.");
            }

            messageApi.success(data.message || "Đăng ký thành công.");
            setServerSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
            setForm(initialForm);
            setErrors({});
            setVerificationRequested(false);
            setCooldown(0);

            window.setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);
        } catch (error) {
            const statusCode = error.response?.status;
            const nextMessage = error.response?.data?.message || error.message || "Đăng ký thất bại.";
            setServerError(nextMessage);

            if (statusCode === 410 || statusCode === 429) {
                setForm((prev) => ({ ...prev, verificationCode: "" }));
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {contextHolder}
            <AuthLayout
                title="Tạo tài khoản"
                description="Đăng ký để đặt lịch khám tại CarePlus"
            >
                <AuthCard
                    footer={(
                        <p>
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="font-medium text-[#0092b8] hover:text-[#007fa0]">
                                Đăng nhập
                            </Link>
                        </p>
                    )}
                >
                    {serverError ? (
                        <div className="mb-[15px] rounded-[13px] border border-rose-200 bg-rose-50 px-4 py-3 text-[12px] text-rose-700">
                            {serverError}
                        </div>
                    ) : null}

                    {!serverError && serverSuccess ? (
                        <div className="mb-[15px] rounded-[13px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] text-emerald-700">
                            {serverSuccess}
                        </div>
                    ) : null}

                    <form className="space-y-[15px]" onSubmit={handleSubmit} noValidate>
                        <FormField
                            id="username"
                            name="username"
                            label="Tên đăng nhập"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="nhapusername"
                            autoComplete="username"
                            error={errors.username}
                            icon={<UserOutlined />}
                            readOnly={lockedRegistrationFields}
                        />

                        <FormField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            autoComplete="email"
                            error={errors.email}
                            icon={<MailOutlined />}
                            readOnly={lockedRegistrationFields}
                        />

                        <PasswordField
                            id="password"
                            name="password"
                            label="Mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Tối thiểu 6 ký tự"
                            autoComplete="new-password"
                            error={errors.password}
                            icon={<LockOutlined />}
                            readOnly={lockedRegistrationFields}
                        />

                        <PasswordField
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                            error={errors.confirmPassword}
                            icon={<LockOutlined />}
                            readOnly={lockedRegistrationFields}
                        />

                        <FormField
                            id="verificationCode"
                            name="verificationCode"
                            label="Mã xác thực"
                            value={form.verificationCode}
                            onChange={handleChange}
                            placeholder="Nhập mã OTP"
                            inputMode="numeric"
                            maxLength={VERIFICATION_CODE_LENGTH}
                            error={errors.verificationCode}
                            hint={verificationHint}
                            icon={<SafetyCertificateOutlined />}
                            action={(
                                <button
                                    type="button"
                                    onClick={handleSendCode}
                                    disabled={!canResendCode}
                                    className="inline-flex shrink-0 items-center gap-1 rounded-[9px] border border-[#dbe4ea] px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    {sendingCode ? <LoadingOutlined /> : <SendOutlined />}
                                    {sendingCode ? "Đang gửi" : cooldown > 0 ? `Gửi lại ${cooldown}s` : "Gửi mã"}
                                </button>
                            )}
                        />

                        <div className="pt-[15px]">
                            <SubmitButton
                                loading={submitting}
                                disabled={submitting || sendingCode}
                                icon={submitting ? <LoadingOutlined /> : <UserAddOutlined className="text-[13px]" />}
                            >
                                {submitting ? "Đang đăng ký..." : "Tạo tài khoản"}
                            </SubmitButton>
                        </div>
                    </form>
                </AuthCard>
            </AuthLayout>
        </>
    );
};

export default RegisterPage;

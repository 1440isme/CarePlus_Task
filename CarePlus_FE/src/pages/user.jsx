import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    BellOutlined,
    CalendarOutlined,
    EditOutlined,
    HomeOutlined,
    LoadingOutlined,
    LogoutOutlined,
    MailOutlined,
    PhoneOutlined,
    RightOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import FormField from "../components/ui/FormField";
import SubmitButton from "../components/ui/SubmitButton";
import { logout, updateProfile } from "../store/slices/authSlice";
import { getMyProfile, updateMyProfile } from "../util/api";

const MENU_ITEMS = [
    { key: "overview", label: "Tổng quan", icon: HomeOutlined },
    { key: "appointments", label: "Lịch hẹn của tôi", icon: CalendarOutlined },
    { key: "booking", label: "Đặt lịch khám", icon: SolutionOutlined },
    { key: "relatives", label: "Hồ sơ người thân", icon: UserOutlined },
    { key: "profile", label: "Thông tin cá nhân", icon: UserOutlined, active: true },
];

const getDisplayName = (profile) => {
    if (!profile) return "Người dùng";
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
    return fullName || profile.username || "Người dùng";
};

const getRoleLabel = (role) => {
    if (role === "admin") return "Quản trị viên";
    return "Bệnh nhân";
};

const getInitials = (name) => {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("");
};

const toInputDate = (value) => {
    if (!value) return "";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().split("T")[0];
};

const formatBirthDate = (value) => {
    if (!value) return "Chưa cập nhật";
    return new Date(value).toLocaleDateString("vi-VN");
};

const UserProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading: authLoading, user } = useSelector((state) => state.auth);
    const [messageApi, contextHolder] = message.useMessage();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        avatar: "",
        birthDate: "",
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        let active = true;

        getMyProfile()
            .then((res) => {
                if (!active) return;

                if (res.data?.success && res.data?.user) {
                    const currentProfile = res.data.user;
                    setProfile(currentProfile);
                    setForm({
                        firstName: currentProfile.firstName || "",
                        lastName: currentProfile.lastName || "",
                        phone: currentProfile.phone || "",
                        address: currentProfile.address || "",
                        avatar: currentProfile.avatar || "",
                        birthDate: toInputDate(currentProfile.birthDate || currentProfile.dateOfBirth),
                    });
                }
            })
            .catch(() => {
                if (active) {
                    messageApi.error("Không thể tải hồ sơ bệnh nhân.");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [isAuthenticated, messageApi]);

    const displayName = useMemo(() => getDisplayName(profile || user), [profile, user]);
    const email = profile?.email || user?.email || "Chưa cập nhật";
    const birthDate = profile?.birthDate || profile?.dateOfBirth || "";

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        setForm({
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            phone: profile?.phone || "",
            address: profile?.address || "",
            avatar: profile?.avatar || "",
            birthDate: toInputDate(profile?.birthDate || profile?.dateOfBirth),
        });
        setIsEditing(false);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);

        try {
            const payload = {
                firstName: form.firstName || null,
                lastName: form.lastName || null,
                phone: form.phone || null,
                address: form.address || null,
                avatar: form.avatar || null,
                dateOfBirth: form.birthDate || null,
            };

            const res = await updateMyProfile(payload);

            if (res.data?.success && res.data?.user) {
                const updatedProfile = {
                    ...res.data.user,
                    birthDate: form.birthDate || res.data.user.birthDate || res.data.user.dateOfBirth || null,
                };

                setProfile(updatedProfile);
                dispatch(updateProfile(updatedProfile));
                setIsEditing(false);
                messageApi.success("Đã cập nhật hồ sơ bệnh nhân.");
            }
        } catch (error) {
            const apiMessage = error.response?.data?.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại.";
            messageApi.error(apiMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    if (authLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] text-slate-500">
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
                    <LoadingOutlined className="text-lg text-[#0092b8]" />
                    <span className="text-sm font-medium">Đang tải hồ sơ bệnh nhân...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {contextHolder}
            <div className="min-h-screen bg-[#f9fafb] text-slate-700">
                <div className="flex min-h-screen flex-col lg:flex-row">
                    <aside className="flex w-full flex-col border-b border-slate-100 bg-white lg:min-h-screen lg:w-56 lg:border-b-0 lg:border-r">
                        <div className="border-b border-slate-100 px-4 py-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#0092b8] text-sm text-white">
                                    <SolutionOutlined />
                                </div>
                                <div className="text-[15px] font-semibold text-slate-900">
                                    Care<span className="text-[#0092b8]">Plus</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-slate-100 px-3 py-3">
                            <div className="flex items-center gap-3 rounded-xl bg-[#ecfeff] px-3 py-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0092b8] text-xs font-semibold text-white">
                                    {getInitials(displayName) || "BN"}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-[13px] font-medium text-slate-900">{displayName}</p>
                                    <p className="text-[11px] text-[#0092b8]">{getRoleLabel(profile?.role || user?.role)}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-3 py-3">
                            <ul className="space-y-1">
                                {MENU_ITEMS.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <li key={item.key}>
                                            <button
                                                type="button"
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
                                                    item.active
                                                        ? "bg-[#0092b8] text-white shadow-sm"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                <Icon className="text-[13px]" />
                                                <span className="flex-1">{item.label}</span>
                                                {item.active ? <RightOutlined className="text-[10px]" /> : null}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="border-t border-slate-100 px-3 py-3">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-slate-600 transition hover:bg-slate-50"
                            >
                                <HomeOutlined className="text-[13px]" />
                                <span>Về trang chủ</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                            >
                                <LogoutOutlined className="text-[13px]" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </aside>

                    <div className="flex min-w-0 flex-1 flex-col">
                        <header className="flex h-14 items-center justify-end border-b border-slate-100 bg-white px-4 sm:px-6">
                            <button
                                type="button"
                                className="relative mr-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50"
                            >
                                <BellOutlined className="text-base" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                            </button>
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition hover:text-slate-800"
                            >
                                <LogoutOutlined />
                                <span>Đăng xuất</span>
                            </button>
                        </header>

                        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
                            <div className="max-w-[640px]">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <h1 className="text-[22px] font-bold text-slate-900">Thông tin cá nhân</h1>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing((prev) => !prev)}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <EditOutlined />
                                        <span>{isEditing ? "Thu gọn" : "Chỉnh sửa"}</span>
                                    </button>
                                </div>

                                <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                                    <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-5 sm:px-6">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0092b8] text-2xl text-white">
                                            {form.avatar || profile?.avatar ? (
                                                <img
                                                    src={form.avatar || profile?.avatar}
                                                    alt="Ảnh đại diện"
                                                    className="h-full w-full rounded-2xl object-cover"
                                                />
                                            ) : (
                                                <UserOutlined />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold text-slate-900">{displayName}</p>
                                            <p className="text-[13px] text-[#0092b8]">{getRoleLabel(profile?.role || user?.role)}</p>
                                        </div>
                                    </div>

                                    {!isEditing ? (
                                        <div className="space-y-5 px-4 py-5 sm:px-6">
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400">Họ và tên</p>
                                                <div className="mt-2 flex items-center gap-2 text-[13px] text-slate-700">
                                                    <UserOutlined className="text-slate-400" />
                                                    <span>{displayName}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400">Email</p>
                                                <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-slate-700">
                                                    <MailOutlined className="text-slate-400" />
                                                    <span>{email}</span>
                                                    <span className="text-[11px] text-slate-400">(không thể thay đổi)</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400">Số điện thoại</p>
                                                <div className="mt-2 flex items-center gap-2 text-[13px] text-slate-700">
                                                    <PhoneOutlined className="text-slate-400" />
                                                    <span>{profile?.phone || "Chưa cập nhật"}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400">Ngày sinh</p>
                                                <div className="mt-2 flex items-center gap-2 text-[13px] text-slate-700">
                                                    <CalendarOutlined className="text-slate-400" />
                                                    <span>{formatBirthDate(birthDate)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-medium text-slate-400">Địa chỉ</p>
                                                <div className="mt-2 flex items-start gap-2 text-[13px] text-slate-700">
                                                    <RightOutlined className="mt-0.5 text-[10px] text-slate-400" />
                                                    <span>{profile?.address || "Chưa cập nhật"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSave} className="space-y-5 px-4 py-5 sm:px-6">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    id="firstName"
                                                    name="firstName"
                                                    label="Họ"
                                                    value={form.firstName}
                                                    onChange={handleChange}
                                                    placeholder="Nhập họ"
                                                />
                                                <FormField
                                                    id="lastName"
                                                    name="lastName"
                                                    label="Tên"
                                                    value={form.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Nhập tên"
                                                />
                                            </div>

                                            <FormField
                                                id="phone"
                                                name="phone"
                                                label="Số điện thoại"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder="Nhập số điện thoại"
                                            />

                                            <FormField
                                                id="address"
                                                name="address"
                                                label="Địa chỉ"
                                                value={form.address}
                                                onChange={handleChange}
                                                placeholder="Nhập địa chỉ"
                                            />

                                            <FormField
                                                id="avatar"
                                                name="avatar"
                                                label="Liên kết ảnh đại diện"
                                                type="url"
                                                value={form.avatar}
                                                onChange={handleChange}
                                                placeholder="https://example.com/avatar.jpg"
                                            />

                                            <FormField
                                                id="birthDate"
                                                name="birthDate"
                                                label="Ngày sinh"
                                                type="date"
                                                value={form.birthDate}
                                                onChange={handleChange}
                                            />

                                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Hủy
                                                </button>
                                                <div className="sm:w-44">
                                                    <SubmitButton loading={saving} disabled={saving}>
                                                        {saving ? "Đang lưu..." : "Lưu thay đổi"}
                                                    </SubmitButton>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfilePage;

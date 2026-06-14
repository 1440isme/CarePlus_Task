import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    CalendarOutlined,
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    LoadingOutlined,
    LogoutOutlined,
    MailOutlined,
    PhoneOutlined,
    PlusOutlined,
    RightOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { message } from "antd";
import FormField from "../components/ui/FormField";
import NotificationBell from "../components/ui/NotificationBell";
import SubmitButton from "../components/ui/SubmitButton";
import { logout, updateProfile } from "../store/slices/authSlice";
import {
    cancelAppointmentApi,
    createRelativeApi,
    deleteRelativeApi,
    getMyAppointmentsApi,
    getMyEngagement,
    getMyProfile,
    getMyRelativesApi,
    updateMyProfile,
    updateRelativeApi,
} from "../util/api";

const MENU_ITEMS = [
    { key: "overview", label: "Tổng quan", icon: HomeOutlined },
    { key: "appointments", label: "Lịch hẹn của tôi", icon: CalendarOutlined },
    { key: "booking", label: "Đặt lịch khám", icon: SolutionOutlined },
    { key: "relatives", label: "Hồ sơ người thân", icon: UserOutlined },
    { key: "profile", label: "Thông tin cá nhân", icon: UserOutlined },
];

const TAB_TITLES = {
    overview: "Tổng quan bệnh nhân",
    appointments: "Lịch hẹn của tôi",
    booking: "Đặt lịch khám",
    relatives: "Hồ sơ người thân",
    profile: "Thông tin cá nhân",
};

const RELATIONSHIP_OPTIONS = [
    "Bố",
    "Mẹ",
    "Vợ",
    "Chồng",
    "Con",
    "Anh/Chị/Em",
    "Ông/Bà",
    "Người thân khác",
];

const getDisplayName = (profile) => {
    if (!profile) return "Người dùng";
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();
    return fullName || profile.username || "Người dùng";
};

const getRoleLabel = (role) => (role === "admin" ? "Quản trị viên" : "Bệnh nhân");

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

const statusLabel = (status) => ({
    CANCELLED: "Đã hủy",
    COMPLETED: "Hoàn tất",
    CONFIRMED: "Đã xác nhận",
    PENDING: "Chờ xác nhận",
    NO_SHOW: "Vắng mặt",
}[status] || status);

const statusClass = (status) => ({
    CANCELLED: "bg-slate-200 text-slate-600",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    NO_SHOW: "bg-rose-100 text-rose-700",
    CONFIRMED: "bg-sky-100 text-sky-700",
    PENDING: "bg-amber-100 text-amber-700",
}[status] || "bg-slate-100 text-slate-700");

const emptyRelativeForm = {
    fullName: "",
    relationship: "Bố",
    phone: "",
    gender: "",
    dateOfBirth: "",
    note: "",
    isPrimary: false,
};

const UserProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading: authLoading, user } = useSelector((state) => state.auth);
    const [messageApi, contextHolder] = message.useMessage();

    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState(null);
    const [engagement, setEngagement] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [relatives, setRelatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [savingRelative, setSavingRelative] = useState(false);
    const [editingRelativeId, setEditingRelativeId] = useState(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        avatar: "",
        birthDate: "",
    });
    const [relativeForm, setRelativeForm] = useState(emptyRelativeForm);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, isAuthenticated, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        let active = true;

        Promise.all([
            getMyProfile(),
            getMyEngagement(),
            getMyAppointmentsApi(),
            getMyRelativesApi(),
        ])
            .then(([profileRes, engagementRes, appointmentsRes, relativesRes]) => {
                if (!active) return;

                if (profileRes.data?.success && profileRes.data?.user) {
                    const currentProfile = profileRes.data.user;
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

                if (engagementRes.data?.success) {
                    setEngagement(engagementRes.data.data);
                }

                if (appointmentsRes.data?.success) {
                    setAppointments(appointmentsRes.data.items || []);
                }

                if (relativesRes.data?.success) {
                    setRelatives(relativesRes.data.items || []);
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
    const rewardWallet = engagement?.rewardWallet || { points: 0, totalEarned: 0 };
    const vouchers = engagement?.vouchers || [];
    const favoriteDoctors = engagement?.favoriteDoctors || [];
    const recentlyViewedDoctors = engagement?.recentlyViewedDoctors || [];
    const myReviews = engagement?.myReviews || [];
    const activeAppointments = appointments.filter((item) => !["CANCELLED", "COMPLETED"].includes(item.status));
    const primaryRelative = relatives.find((item) => item.isPrimary) || null;

    const overviewStats = [
        { label: "Lịch hẹn đang hiệu lực", value: activeAppointments.length, tone: "bg-sky-50 text-sky-600" },
        { label: "Bác sĩ yêu thích", value: favoriteDoctors.length, tone: "bg-rose-50 text-rose-600" },
        { label: "Điểm tích lũy", value: rewardWallet.points, tone: "bg-emerald-50 text-emerald-600" },
        { label: "Hồ sơ người thân", value: relatives.length, tone: "bg-violet-50 text-violet-600" },
    ];

    const reloadAppointments = async () => {
        const res = await getMyAppointmentsApi();
        if (res.data?.success) {
            setAppointments(res.data.items || []);
        }
    };

    const reloadRelatives = async () => {
        const res = await getMyRelativesApi();
        if (res.data?.success) {
            setRelatives(res.data.items || []);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleRelativeFieldChange = (event) => {
        const { name, value, type, checked } = event.target;
        setRelativeForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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
        setIsEditingProfile(false);
    };

    const resetRelativeForm = () => {
        setRelativeForm(emptyRelativeForm);
        setEditingRelativeId(null);
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
                setIsEditingProfile(false);
                messageApi.success("Đã cập nhật hồ sơ bệnh nhân.");
            }
        } catch (error) {
            const apiMessage = error.response?.data?.message || "Cập nhật hồ sơ thất bại. Vui lòng thử lại.";
            messageApi.error(apiMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveRelative = async (event) => {
        event.preventDefault();
        setSavingRelative(true);
        try {
            const payload = {
                ...relativeForm,
                gender: relativeForm.gender || null,
                dateOfBirth: relativeForm.dateOfBirth || null,
                phone: relativeForm.phone || null,
                note: relativeForm.note || null,
            };

            if (editingRelativeId) {
                await updateRelativeApi(editingRelativeId, payload);
                messageApi.success("Đã cập nhật hồ sơ người thân.");
            } else {
                await createRelativeApi(payload);
                messageApi.success("Đã thêm hồ sơ người thân.");
            }

            await reloadRelatives();
            resetRelativeForm();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể lưu hồ sơ người thân.");
        } finally {
            setSavingRelative(false);
        }
    };

    const handleEditRelative = (relative) => {
        setActiveTab("relatives");
        setEditingRelativeId(relative.id);
        setRelativeForm({
            fullName: relative.fullName || "",
            relationship: relative.relationship || "Bố",
            phone: relative.phone || "",
            gender: relative.gender || "",
            dateOfBirth: toInputDate(relative.dateOfBirth),
            note: relative.note || "",
            isPrimary: Boolean(relative.isPrimary),
        });
    };

    const handleDeleteRelative = async (relativeId) => {
        try {
            await deleteRelativeApi(relativeId);
            await reloadRelatives();
            if (editingRelativeId === relativeId) {
                resetRelativeForm();
            }
            messageApi.success("Đã xóa hồ sơ người thân.");
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể xóa hồ sơ người thân.");
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login", { replace: true });
    };

    const handleCancelAppointment = async (appointmentId) => {
        try {
            await cancelAppointmentApi(appointmentId);
            await reloadAppointments();
            messageApi.success("Đã hủy lịch hẹn.");
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể hủy lịch hẹn.");
        }
    };

    const renderProfileSection = () => (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
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

                {!isEditingProfile ? (
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
                            <FormField id="firstName" name="firstName" label="Họ" value={form.firstName} onChange={handleChange} placeholder="Nhập họ" />
                            <FormField id="lastName" name="lastName" label="Tên" value={form.lastName} onChange={handleChange} placeholder="Nhập tên" />
                        </div>

                        <FormField id="phone" name="phone" label="Số điện thoại" value={form.phone} onChange={handleChange} placeholder="Nhập số điện thoại" />
                        <FormField id="address" name="address" label="Địa chỉ" value={form.address} onChange={handleChange} placeholder="Nhập địa chỉ" />
                        <FormField id="avatar" name="avatar" label="Liên kết ảnh đại diện" type="url" value={form.avatar} onChange={handleChange} placeholder="https://example.com/avatar.jpg" />
                        <FormField id="birthDate" name="birthDate" label="Ngày sinh" type="date" value={form.birthDate} onChange={handleChange} />

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

            <aside className="space-y-6">
                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <h2 className="text-[16px] font-semibold text-slate-900">Điểm và ưu đãi</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-sky-50 px-4 py-4">
                            <p className="text-[11px] font-medium text-sky-500">Điểm hiện có</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{rewardWallet.points}</p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 px-4 py-4">
                            <p className="text-[11px] font-medium text-emerald-500">Tổng đã nhận</p>
                            <p className="mt-2 text-2xl font-bold text-slate-900">{rewardWallet.totalEarned}</p>
                        </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-700">
                        Mỗi đánh giá bác sĩ hợp lệ sẽ cộng 50 điểm và tặng voucher giảm phí khám cho lần đặt kế tiếp.
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <h2 className="text-[16px] font-semibold text-slate-900">Voucher của tôi</h2>
                    <div className="mt-4 space-y-3">
                        {vouchers.length > 0 ? vouchers.slice(0, 3).map((voucher) => (
                            <article key={voucher.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                                <p className="text-[13px] font-semibold text-slate-900">{voucher.title}</p>
                                <p className="mt-1 text-[12px] text-[#0092b8]">{voucher.code}</p>
                                <p className="mt-2 text-[12px] text-slate-500">
                                    Giảm {voucher.discountAmount.toLocaleString("vi-VN")}đ, hết hạn {new Date(voucher.expiresAt).toLocaleDateString("vi-VN")}
                                </p>
                            </article>
                        )) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                                Chưa có voucher nào. Hãy gửi đánh giá sau khi khám để nhận ưu đãi.
                            </div>
                        )}
                    </div>
                </section>
            </aside>
        </div>
    );

    const renderAppointmentsSection = () => (
        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="grid gap-4 md:grid-cols-2">
                {appointments.length > 0 ? appointments.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[14px] font-semibold text-slate-900">{item.doctor?.fullName}</p>
                                <p className="mt-1 text-[12px] text-slate-500">{item.doctor?.specialty?.name || "Chuyên khoa"}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass(item.status)}`}>
                                {statusLabel(item.status)}
                            </span>
                        </div>
                        <p className="mt-3 text-[13px] text-slate-700">
                            {new Date(item.appointmentDate).toLocaleDateString("vi-VN")} • {item.startTime} - {item.endTime}
                        </p>
                        <p className="mt-1 text-[12px] text-slate-500">Bệnh nhân: {item.patientName} • {item.patientPhone}</p>
                        {item.note ? <p className="mt-2 text-[12px] text-slate-500">{item.note}</p> : null}
                        {!["CANCELLED", "COMPLETED"].includes(item.status) ? (
                            <button
                                type="button"
                                onClick={() => handleCancelAppointment(item.id)}
                                className="mt-4 inline-flex rounded-xl border border-rose-200 px-3 py-2 text-[12px] font-medium text-rose-600 transition hover:bg-rose-50"
                            >
                                Hủy lịch hẹn
                            </button>
                        ) : null}
                    </article>
                )) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                        Bạn chưa có lịch hẹn nào.
                    </div>
                )}
            </div>
        </section>
    );

    const renderBookingSection = () => (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <h2 className="text-[16px] font-semibold text-slate-900">Đặt lịch nhanh</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Vào danh sách bác sĩ để chọn bác sĩ, chuyên khoa và khung giờ phù hợp. Luồng đặt lịch hiện đã hoạt động thật.
                </p>
                <button
                    type="button"
                    onClick={() => navigate("/doctors")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0092b8] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#007da0]"
                >
                    <SolutionOutlined />
                    <span>Mở trang đặt lịch</span>
                </button>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <h2 className="text-[16px] font-semibold text-slate-900">Người thân ưu tiên</h2>
                {primaryRelative ? (
                    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4">
                        <p className="text-[14px] font-semibold text-slate-900">{primaryRelative.fullName}</p>
                        <p className="mt-1 text-[12px] text-slate-500">{primaryRelative.relationship}</p>
                        <p className="mt-1 text-[12px] text-slate-500">{primaryRelative.phone || "Chưa có số điện thoại"}</p>
                    </div>
                ) : (
                    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                        Bạn chưa có hồ sơ người thân ưu tiên. Thêm ở tab `Hồ sơ người thân`.
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <h2 className="text-[16px] font-semibold text-slate-900">Bác sĩ yêu thích</h2>
                <div className="mt-4 space-y-3">
                    {favoriteDoctors.length > 0 ? favoriteDoctors.slice(0, 4).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => navigate(`/doctors/${item.doctor?.slug || item.doctor?.id}`)}
                            className="block w-full rounded-2xl bg-slate-50 px-4 py-4 text-left transition hover:bg-slate-100"
                        >
                            <p className="text-[13px] font-semibold text-slate-900">{item.doctor?.fullName}</p>
                            <p className="mt-1 text-[12px] text-slate-500">{item.doctor?.specialty?.name || "Chuyên khoa"}</p>
                        </button>
                    )) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                            Bạn chưa lưu bác sĩ yêu thích nào.
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <h2 className="text-[16px] font-semibold text-slate-900">Bác sĩ đã xem gần đây</h2>
                <div className="mt-4 space-y-3">
                    {recentlyViewedDoctors.length > 0 ? recentlyViewedDoctors.slice(0, 4).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => navigate(`/doctors/${item.doctor?.slug || item.doctor?.id}`)}
                            className="block w-full rounded-2xl bg-slate-50 px-4 py-4 text-left transition hover:bg-slate-100"
                        >
                            <p className="text-[13px] font-semibold text-slate-900">{item.doctor?.fullName}</p>
                            <p className="mt-1 text-[12px] text-slate-500">
                                Xem lúc {new Date(item.viewedAt).toLocaleDateString("vi-VN")}
                            </p>
                        </button>
                    )) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                            Chưa có lịch sử xem bác sĩ gần đây.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );

    const renderRelativesSection = () => (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <h2 className="text-[16px] font-semibold text-slate-900">Danh sách người thân</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {relatives.length > 0 ? relatives.map((item) => (
                        <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[14px] font-semibold text-slate-900">{item.fullName}</p>
                                    <p className="mt-1 text-[12px] text-slate-500">{item.relationship}</p>
                                </div>
                                {item.isPrimary ? (
                                    <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold text-sky-700">Ưu tiên</span>
                                ) : null}
                            </div>
                            <p className="mt-3 text-[12px] text-slate-500">Điện thoại: {item.phone || "Chưa cập nhật"}</p>
                            <p className="mt-1 text-[12px] text-slate-500">Ngày sinh: {formatBirthDate(item.dateOfBirth)}</p>
                            {item.note ? <p className="mt-2 text-[12px] text-slate-500">{item.note}</p> : null}
                            <div className="mt-4 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleEditRelative(item)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-[12px] font-medium text-slate-600 transition hover:bg-white"
                                >
                                    <EditOutlined />
                                    <span>Sửa</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteRelative(item.id)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-[12px] font-medium text-rose-600 transition hover:bg-rose-50"
                                >
                                    <DeleteOutlined />
                                    <span>Xóa</span>
                                </button>
                            </div>
                        </article>
                    )) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                            Bạn chưa tạo hồ sơ người thân nào.
                        </div>
                    )}
                </div>
            </section>

            <aside className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-[16px] font-semibold text-slate-900">
                        {editingRelativeId ? "Cập nhật người thân" : "Thêm người thân"}
                    </h2>
                    {editingRelativeId ? (
                        <button
                            type="button"
                            onClick={resetRelativeForm}
                            className="text-[12px] font-medium text-slate-500 hover:text-slate-800"
                        >
                            Tạo mới
                        </button>
                    ) : null}
                </div>
                <form onSubmit={handleSaveRelative} className="mt-4 space-y-4">
                    <FormField id="relativeFullName" name="fullName" label="Họ và tên" value={relativeForm.fullName} onChange={handleRelativeFieldChange} placeholder="Nhập họ tên người thân" />

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Mối quan hệ</label>
                        <select
                            name="relationship"
                            value={relativeForm.relationship}
                            onChange={handleRelativeFieldChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                        >
                            {RELATIONSHIP_OPTIONS.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <FormField id="relativePhone" name="phone" label="Số điện thoại" value={relativeForm.phone} onChange={handleRelativeFieldChange} placeholder="Nhập số điện thoại" />

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Giới tính</label>
                        <select
                            name="gender"
                            value={relativeForm.gender}
                            onChange={handleRelativeFieldChange}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                        >
                            <option value="">Chưa chọn</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                            <option value="OTHER">Khác</option>
                        </select>
                    </div>

                    <FormField id="relativeDob" name="dateOfBirth" label="Ngày sinh" type="date" value={relativeForm.dateOfBirth} onChange={handleRelativeFieldChange} />

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Ghi chú</label>
                        <textarea
                            name="note"
                            value={relativeForm.note}
                            onChange={handleRelativeFieldChange}
                            rows={4}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                            placeholder="Dị ứng thuốc, bệnh nền, lưu ý cho lần khám sau..."
                        />
                    </div>

                    <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            name="isPrimary"
                            checked={relativeForm.isPrimary}
                            onChange={handleRelativeFieldChange}
                            className="h-4 w-4 rounded border-slate-300 accent-[#0092b8]"
                        />
                        Đặt làm hồ sơ người thân ưu tiên
                    </label>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <SubmitButton loading={savingRelative} disabled={savingRelative}>
                                {savingRelative ? "Đang lưu..." : editingRelativeId ? "Cập nhật" : "Thêm người thân"}
                            </SubmitButton>
                        </div>
                        {editingRelativeId ? (
                            <button
                                type="button"
                                onClick={resetRelativeForm}
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Hủy
                            </button>
                        ) : null}
                    </div>
                </form>
            </aside>
        </div>
    );

    const renderOverviewSection = () => (
        <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {overviewStats.map((item) => (
                    <article key={item.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        <div className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${item.tone}`}>
                            {item.label}
                        </div>
                        <p className="mt-4 text-3xl font-bold text-slate-900">{item.value}</p>
                    </article>
                ))}
            </section>

            <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <h2 className="text-[16px] font-semibold text-slate-900">Lịch hẹn gần nhất</h2>
                    <div className="mt-4 space-y-3">
                        {appointments.slice(0, 3).map((item) => (
                            <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-900">{item.doctor?.fullName}</p>
                                        <p className="mt-1 text-[12px] text-slate-500">
                                            {new Date(item.appointmentDate).toLocaleDateString("vi-VN")} • {item.startTime} - {item.endTime}
                                        </p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass(item.status)}`}>
                                        {statusLabel(item.status)}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {appointments.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                                Chưa có lịch hẹn nào.
                            </div>
                        ) : null}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                    <h2 className="text-[16px] font-semibold text-slate-900">Tương tác gần đây</h2>
                    <div className="mt-4 space-y-3">
                        {myReviews.slice(0, 2).map((item) => (
                            <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                                <p className="text-[13px] font-semibold text-slate-900">{item.doctor?.fullName}</p>
                                <p className="mt-1 text-[12px] text-slate-500">{item.rating}/5 sao • +{item.rewardPoints} điểm</p>
                            </div>
                        ))}
                        {favoriteDoctors.slice(0, 1).map((item) => (
                            <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                                <p className="text-[13px] font-semibold text-slate-900">{item.doctor?.fullName}</p>
                                <p className="mt-1 text-[12px] text-slate-500">Đã lưu vào danh sách yêu thích</p>
                            </div>
                        ))}
                        {myReviews.length === 0 && favoriteDoctors.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                                Chưa có tương tác gần đây.
                            </div>
                        ) : null}
                    </div>
                </section>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
                return renderOverviewSection();
            case "appointments":
                return renderAppointmentsSection();
            case "booking":
                return renderBookingSection();
            case "relatives":
                return renderRelativesSection();
            case "profile":
            default:
                return renderProfileSection();
        }
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
                    <aside className="flex w-full flex-col border-b border-slate-100 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
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
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0092b8] text-sm font-semibold text-white">
                                    {getInitials(displayName) || "BN"}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-[15px] font-medium text-slate-900">{displayName}</p>
                                    <p className="text-[12px] text-[#0092b8]">{getRoleLabel(profile?.role || user?.role)}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 px-3 py-3">
                            <ul className="space-y-1">
                                {MENU_ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    const active = activeTab === item.key;

                                    return (
                                        <li key={item.key}>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab(item.key)}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[14px] transition ${
                                                    active
                                                        ? "bg-[#0092b8] text-white shadow-sm"
                                                        : "text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                <Icon className="text-[14px]" />
                                                <span className="flex-1">{item.label}</span>
                                                {active ? <RightOutlined className="text-[10px]" /> : null}
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
                        <header className="flex h-14 items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-6">
                            <div>
                                <h1 className="text-[22px] font-bold text-slate-900">{TAB_TITLES[activeTab]}</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                {activeTab === "profile" ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingProfile((prev) => !prev)}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
                                    >
                                        <EditOutlined />
                                        <span>{isEditingProfile ? "Thu gọn" : "Chỉnh sửa"}</span>
                                    </button>
                                ) : null}
                                {activeTab === "relatives" ? (
                                    <button
                                        type="button"
                                        onClick={resetRelativeForm}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0092b8] px-4 text-[13px] font-medium text-white transition hover:bg-[#007da0]"
                                    >
                                        <PlusOutlined />
                                        <span>Thêm người thân</span>
                                    </button>
                                ) : null}
                                <NotificationBell />
                            </div>
                        </header>

                        <section className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
                            <div className="max-w-[1180px]">
                                {renderContent()}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfilePage;

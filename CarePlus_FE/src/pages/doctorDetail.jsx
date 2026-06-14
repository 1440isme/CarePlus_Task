import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { message } from "antd";
import {
    CalendarOutlined,
    CheckCircleFilled,
    HeartFilled,
    HeartOutlined,
    LeftOutlined,
    LoadingOutlined,
    MinusOutlined,
    PhoneOutlined,
    PlusOutlined,
    RightOutlined,
    StarFilled,
    UserOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "../components/public/PublicLayout";
import { DoctorCard, SectionTitle } from "../components/public/CatalogCards";
import {
    createAppointmentApi,
    getDoctorAvailableSlots,
    getDoctorDetail,
    getMyEngagement,
    submitDoctorReviewApi,
    toggleFavoriteDoctorApi,
    trackDoctorViewApi,
} from "../util/api";

const toDateCardLabel = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return { day: "--", label: "Không hợp lệ" };
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return {
        day: String(date.getDate()).padStart(2, "0"),
        label: `${weekdays[date.getDay()]} • Th${date.getMonth() + 1}`,
    };
};

const DoctorDetailPage = () => {
    const { slugOrId } = useParams();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [bookingQuantity, setBookingQuantity] = useState(1);
    const [engagement, setEngagement] = useState(null);
    const [togglingFavorite, setTogglingFavorite] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [submittingBooking, setSubmittingBooking] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        visitDate: new Date().toISOString().slice(0, 10),
        comment: "",
    });
    const [bookingForm, setBookingForm] = useState({
        patientName: "",
        patientPhone: "",
        note: "",
    });

    useEffect(() => {
        let active = true;

        getDoctorDetail(slugOrId)
            .then((res) => {
                if (active && res.data?.success) {
                    const nextDoctor = res.data.item;
                    setDoctor(nextDoctor);
                    setActiveImageIndex(0);
                    setSelectedDate(nextDoctor.schedules?.[0]?.date || new Date().toISOString().slice(0, 10));
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
    }, [slugOrId]);

    useEffect(() => {
        if (!slugOrId || !selectedDate) return;
        getDoctorAvailableSlots(slugOrId, selectedDate).then((res) => {
            if (res.data?.success) {
                setSlots(res.data.slots || []);
                setSelectedSlot("");
            }
        });
    }, [selectedDate, slugOrId]);

    useEffect(() => {
        if (!isAuthenticated || !slugOrId) return;
        trackDoctorViewApi(slugOrId).catch(() => {});
    }, [isAuthenticated, slugOrId]);

    useEffect(() => {
        if (!isAuthenticated) {
            setEngagement(null);
            return;
        }

        getMyEngagement()
            .then((res) => {
                if (res.data?.success) {
                    setEngagement(res.data.data);
                }
            })
            .catch(() => {});
    }, [isAuthenticated]);

    useEffect(() => {
        setBookingForm((prev) => ({
            ...prev,
            patientName: prev.patientName || [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim(),
            patientPhone: prev.patientPhone || user?.phone || "",
        }));
    }, [user]);

    const gallery = useMemo(() => {
        const items = doctor?.gallery?.length ? doctor.gallery : [];
        if (doctor?.image && !items.includes(doctor.image)) {
            return [doctor.image, ...items];
        }
        return items;
    }, [doctor]);

    const activeImage = useMemo(() => gallery?.[activeImageIndex] || doctor?.image, [activeImageIndex, doctor, gallery]);
    const doctorEngagement = doctor?.engagement || {};
    const favoriteDoctorIds = engagement?.favoriteDoctorIds || [];
    const myReviews = engagement?.myReviews || [];
    const isFavorited = doctor ? favoriteDoctorIds.includes(doctor.id) : false;
    const hasReviewed = doctor ? myReviews.some((item) => item.doctor?.id === doctor.id) : false;
    const dateChoices = doctor?.schedules || [];
    const selectedSlotData = slots.find((slot) => slot.startTime === selectedSlot) || null;

    const reloadEngagement = async () => {
        if (!isAuthenticated) return;
        const res = await getMyEngagement();
        if (res.data?.success) {
            setEngagement(res.data.data);
        }
    };

    const reloadDoctorDetail = async () => {
        const res = await getDoctorDetail(slugOrId);
        if (res.data?.success) {
            setDoctor(res.data.item);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!doctor || !isAuthenticated || togglingFavorite) return;

        setTogglingFavorite(true);
        try {
            const res = await toggleFavoriteDoctorApi(doctor.id);
            if (res.data?.success) {
                await Promise.all([reloadEngagement(), reloadDoctorDetail()]);
                const nextFavorited = res.data.data?.isFavorited;
                messageApi.success(nextFavorited ? "Đã thêm bác sĩ vào danh sách yêu thích." : "Đã xóa bác sĩ khỏi danh sách yêu thích.");
            }
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể cập nhật bác sĩ yêu thích.");
        } finally {
            setTogglingFavorite(false);
        }
    };

    const handleReviewFieldChange = (event) => {
        const { name, value } = event.target;
        setReviewForm((prev) => ({
            ...prev,
            [name]: name === "rating" ? Number(value) : value,
        }));
    };

    const handleBookingFieldChange = (event) => {
        const { name, value } = event.target;
        setBookingForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmitReview = async (event) => {
        event.preventDefault();
        if (!doctor || submittingReview) return;

        setSubmittingReview(true);
        try {
            const res = await submitDoctorReviewApi({
                doctorId: doctor.id,
                rating: reviewForm.rating,
                visitDate: reviewForm.visitDate,
                comment: reviewForm.comment,
            });

            if (res.data?.success) {
                await Promise.all([reloadEngagement(), reloadDoctorDetail()]);
                setReviewForm({
                    rating: 5,
                    visitDate: new Date().toISOString().slice(0, 10),
                    comment: "",
                });
                const reward = res.data?.data?.reward;
                messageApi.success(
                    reward?.voucherCode
                        ? `Đánh giá thành công. Bạn nhận ${reward.pointsEarned} điểm và voucher ${reward.voucherCode}.`
                        : "Đánh giá thành công."
                );
            }
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể gửi đánh giá.");
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleSubmitBooking = async (event) => {
        event.preventDefault();
        if (!doctor || submittingBooking) return;
        if (!selectedSlotData) {
            messageApi.error("Vui lòng chọn khung giờ khám.");
            return;
        }

        setSubmittingBooking(true);
        try {
            const res = await createAppointmentApi({
                doctorId: doctor.id,
                appointmentDate: selectedDate,
                startTime: selectedSlotData.startTime,
                patientName: bookingForm.patientName,
                patientPhone: bookingForm.patientPhone,
                note: bookingForm.note,
                bookingQuantity,
            });

            if (res.data?.success) {
                await reloadDoctorDetail();
                const slotRes = await getDoctorAvailableSlots(slugOrId, selectedDate);
                if (slotRes.data?.success) {
                    setSlots(slotRes.data.slots || []);
                }
                setSelectedSlot("");
                setBookingForm((prev) => ({
                    ...prev,
                    note: "",
                }));
                messageApi.success("Đặt lịch khám thành công. Lịch hẹn đã được lưu vào tài khoản của bạn.");
            }
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể đặt lịch khám.");
        } finally {
            setSubmittingBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500">
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
                    <LoadingOutlined className="text-lg text-[#0092b8]" />
                    <span className="text-sm font-medium">Đang tải chi tiết bác sĩ...</span>
                </div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <PublicLayout clinicInfo={{ phone: "1900 1234", email: "lienhe@careplus.vn", address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh", workingHours: [] }} compact>
                <div className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-slate-950">Không tìm thấy bác sĩ</h1>
                </div>
            </PublicLayout>
        );
    }

    return (
        <>
            {contextHolder}
            <PublicLayout clinicInfo={{ phone: "1900 1234", email: "lienhe@careplus.vn", address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh", workingHours: [] }} compact>
                <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                    <div className="text-sm text-slate-500">
                        <Link to="/" className="hover:text-[#0092b8]">Trang chủ</Link>
                        <span className="mx-2">/</span>
                        <Link to="/doctors" className="hover:text-[#0092b8]">Bác sĩ</Link>
                        <span className="mx-2">/</span>
                        <span>{doctor.fullName}</span>
                    </div>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                        <div>
                            <div className="relative overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                                <img src={activeImage} alt={doctor.fullName} className="h-[420px] w-full object-cover" />
                                {gallery.length > 1 ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                                            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
                                        >
                                            <LeftOutlined />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
                                        >
                                            <RightOutlined />
                                        </button>
                                    </>
                                ) : null}
                            </div>

                            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                                {gallery.map((image, index) => (
                                    <button
                                        key={image}
                                        type="button"
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`overflow-hidden rounded-2xl border ${index === activeImageIndex ? "border-[#0092b8]" : "border-slate-200"}`}
                                    >
                                        <img src={image} alt={`${doctor.fullName} ${index + 1}`} className="h-20 w-24 object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#0092b8]">
                                {doctor.specialty?.name}
                            </div>
                            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">{doctor.fullName}</h1>
                            <p className="mt-2 text-lg text-slate-500">{doctor.title}</p>
                            <p className="mt-5 text-[15px] leading-7 text-slate-600">{doctor.bio}</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600">
                                    {doctorEngagement.favoriteCount || 0} người yêu thích
                                </span>
                                <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-600">
                                    {doctorEngagement.reviewCount || 0} đánh giá
                                </span>
                                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600">
                                    {doctorEngagement.viewCount || 0} lượt xem hồ sơ
                                </span>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Giá khám tham khảo</p>
                                    <p className="mt-2 text-2xl font-bold text-[#0092b8]">{doctor.consultationFee.toLocaleString("vi-VN")}đ</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Đã đặt lịch</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-950">{doctor.bookedCount}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Slot công bố hôm nay</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-950">{doctor.availableSlotsToday}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Kinh nghiệm</p>
                                    <p className="mt-2 text-2xl font-bold text-slate-950">{doctor.experienceYears} năm</p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleFavoriteToggle}
                                    disabled={!isAuthenticated || togglingFavorite}
                                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                                        isFavorited
                                            ? "bg-rose-500 text-white hover:bg-rose-600"
                                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    } ${!isAuthenticated ? "cursor-not-allowed opacity-60" : ""}`}
                                >
                                    {isFavorited ? <HeartFilled /> : <HeartOutlined />}
                                    <span>{isFavorited ? "Đã yêu thích" : "Thêm yêu thích"}</span>
                                </button>
                                {!isAuthenticated ? (
                                    <span className="inline-flex items-center rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500">
                                        Đăng nhập để đặt lịch, lưu bác sĩ yêu thích và nhận thưởng sau khi đánh giá.
                                    </span>
                                ) : null}
                            </div>

                            <div className="mt-6">
                                <p className="text-sm font-semibold text-slate-900">Thông tin thêm</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(doctor.highlights || []).map((item) => (
                                        <span key={item} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <section className="mt-12 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
                        <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                            <SectionTitle
                                title="Đặt lịch khám"
                                description="Chọn ngày và khung giờ theo lịch làm việc thực tế của bác sĩ. Slot đã được đặt sẽ tự động bị khóa."
                            />

                            <div className="mt-6">
                                <p className="text-sm font-semibold text-slate-900">Bước 1. Chọn ngày khám</p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {dateChoices.map((item) => {
                                        const meta = toDateCardLabel(item.date);
                                        const active = selectedDate === item.date;
                                        return (
                                            <button
                                                key={item.date}
                                                type="button"
                                                onClick={() => setSelectedDate(item.date)}
                                                className={`min-w-24 rounded-[22px] border px-4 py-3 text-left transition ${
                                                    active
                                                        ? "border-[#0092b8] bg-cyan-500 text-white shadow-[0_16px_30px_rgba(0,146,184,0.18)]"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-sky-200"
                                                }`}
                                            >
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">{meta.label}</p>
                                                <p className="mt-2 text-2xl font-bold">{meta.day}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-sm font-semibold text-slate-900">Bước 2. Chọn khung giờ</p>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {slots.map((slot) => {
                                        const active = selectedSlot === slot.startTime;
                                        return (
                                            <button
                                                key={slot.startTime}
                                                type="button"
                                                disabled={!slot.available}
                                                onClick={() => slot.available && setSelectedSlot(slot.startTime)}
                                                className={`rounded-2xl border px-4 py-4 text-left transition ${
                                                    !slot.available
                                                        ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                                                        : active
                                                            ? "border-[#0092b8] bg-cyan-500 text-white shadow-[0_14px_26px_rgba(0,146,184,0.18)]"
                                                            : "border-slate-200 bg-white text-slate-700 hover:border-sky-200"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-base font-semibold">{slot.startTime} - {slot.endTime}</p>
                                                        <p className="mt-1 text-xs opacity-80">{slot.available ? "Có thể đặt ngay" : "Đã có người đặt"}</p>
                                                    </div>
                                                    {active ? <CheckCircleFilled className="text-lg" /> : null}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                                {slots.length === 0 ? (
                                    <div className="mt-4 rounded-2xl border border-dashed border-slate-200 px-4 py-5 text-sm text-slate-500">
                                        Ngày đã chọn hiện chưa có lịch làm việc.
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                            <SectionTitle
                                title="Xác nhận thông tin"
                                description="Bố cục được làm theo hướng luồng booking riêng trong file Figma: chọn ngày, chọn giờ, nhập thông tin rồi xác nhận."
                            />

                            {!isAuthenticated ? (
                                <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-600">
                                    Vui lòng đăng nhập trước khi đặt lịch khám.
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitBooking} className="mt-6 space-y-4">
                                    <div className="rounded-2xl bg-sky-50 px-4 py-4 text-sm leading-6 text-slate-700">
                                        <p className="font-semibold text-slate-900">Khung giờ đã chọn</p>
                                        <p className="mt-2">
                                            {selectedSlotData
                                                ? `${selectedDate} • ${selectedSlotData.startTime} - ${selectedSlotData.endTime}`
                                                : "Bạn chưa chọn khung giờ nào."}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-900">Số hồ sơ cần đặt</label>
                                        <div className="mt-3 inline-flex items-center overflow-hidden rounded-2xl border border-slate-200">
                                            <button type="button" onClick={() => setBookingQuantity((prev) => Math.max(1, prev - 1))} className="px-4 py-3 text-slate-600 hover:bg-slate-50">
                                                <MinusOutlined />
                                            </button>
                                            <span className="min-w-14 px-4 text-center font-semibold text-slate-900">{bookingQuantity}</span>
                                            <button type="button" onClick={() => setBookingQuantity((prev) => prev + 1)} className="px-4 py-3 text-slate-600 hover:bg-slate-50">
                                                <PlusOutlined />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-900">Họ tên bệnh nhân</label>
                                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                                            <UserOutlined className="text-slate-400" />
                                            <input
                                                name="patientName"
                                                value={bookingForm.patientName}
                                                onChange={handleBookingFieldChange}
                                                placeholder="Nguyễn Văn A"
                                                className="w-full bg-transparent text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-900">Số điện thoại</label>
                                        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                                            <PhoneOutlined className="text-slate-400" />
                                            <input
                                                name="patientPhone"
                                                value={bookingForm.patientPhone}
                                                onChange={handleBookingFieldChange}
                                                placeholder="0901234567"
                                                className="w-full bg-transparent text-sm outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-slate-900">Ghi chú cho bác sĩ</label>
                                        <textarea
                                            name="note"
                                            value={bookingForm.note}
                                            onChange={handleBookingFieldChange}
                                            rows={4}
                                            placeholder="Triệu chứng chính, nhu cầu tái khám hoặc lưu ý đặc biệt."
                                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingBooking}
                                        className="inline-flex items-center justify-center rounded-2xl bg-[#0092b8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#007da0] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {submittingBooking ? "Đang xử lý lịch hẹn..." : "Xác nhận đặt lịch"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </section>

                    <section className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                            <SectionTitle
                                title="Đánh giá sau khám"
                                description="Tương đương tính năng bình luận, đánh giá sau khi sử dụng dịch vụ. Mỗi đánh giá hợp lệ sẽ nhận điểm thưởng và voucher khám."
                            />
                            <div className="mt-6 space-y-4">
                                {(doctorEngagement.latestReviews || []).length > 0 ? doctorEngagement.latestReviews.map((review) => (
                                    <article key={review.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-slate-900">{review.user?.name}</p>
                                                <p className="text-sm text-slate-500">Khám ngày {new Date(review.visitDate).toLocaleDateString("vi-VN")}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
                                                <StarFilled />
                                                <span>{review.rating}/5</span>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
                                    </article>
                                )) : (
                                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                                        Chưa có đánh giá nào cho bác sĩ này.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                            <SectionTitle
                                title="Nhận thưởng sau đánh giá"
                                description="Sau khi hoàn tất khám, bệnh nhân có thể gửi nhận xét để nhận điểm tích lũy và mã giảm phí khám cho lần tiếp theo."
                            />
                            {!isAuthenticated ? (
                                <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-600">
                                    Vui lòng đăng nhập để gửi đánh giá và nhận voucher khám.
                                </div>
                            ) : hasReviewed ? (
                                <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-5 text-sm leading-6 text-emerald-700">
                                    Bạn đã đánh giá bác sĩ này rồi. Điểm thưởng và voucher đã được cộng vào tài khoản của bạn.
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-900">Số sao</label>
                                        <select
                                            name="rating"
                                            value={reviewForm.rating}
                                            onChange={handleReviewFieldChange}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                                        >
                                            <option value={5}>5 sao - Rất hài lòng</option>
                                            <option value={4}>4 sao - Hài lòng</option>
                                            <option value={3}>3 sao - Bình thường</option>
                                            <option value={2}>2 sao - Cần cải thiện</option>
                                            <option value={1}>1 sao - Chưa hài lòng</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-900">Ngày khám</label>
                                        <input
                                            type="date"
                                            name="visitDate"
                                            value={reviewForm.visitDate}
                                            onChange={handleReviewFieldChange}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-900">Nhận xét</label>
                                        <textarea
                                            name="comment"
                                            value={reviewForm.comment}
                                            onChange={handleReviewFieldChange}
                                            rows={5}
                                            placeholder="Chia sẻ trải nghiệm khám, thái độ phục vụ và chất lượng tư vấn của bác sĩ."
                                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                                        />
                                    </div>
                                    <div className="rounded-2xl bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-700">
                                        Mỗi đánh giá hợp lệ nhận ngay 50 điểm tích lũy và 1 voucher giảm 50.000đ cho lần khám kế tiếp.
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="inline-flex items-center justify-center rounded-2xl bg-[#0092b8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#007da0] disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {submittingReview ? "Đang gửi đánh giá..." : "Gửi đánh giá và nhận thưởng"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </section>

                    <section className="mt-12">
                        <SectionTitle
                            title="Bác sĩ tương tự"
                            description="Các bác sĩ thuộc cùng chuyên khoa để bạn dễ so sánh và lựa chọn."
                        />
                        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {doctor.relatedDoctors.map((item) => (
                                <DoctorCard key={item.id} item={item} />
                            ))}
                        </div>
                    </section>
                </section>
            </PublicLayout>
        </>
    );
};

export default DoctorDetailPage;

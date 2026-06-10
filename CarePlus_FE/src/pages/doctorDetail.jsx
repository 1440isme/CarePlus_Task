import { useEffect, useMemo, useState } from "react";
import { CalendarOutlined, LeftOutlined, LoadingOutlined, MinusOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "../components/public/PublicLayout";
import { DoctorCard, SectionTitle } from "../components/public/CatalogCards";
import { getDoctorAvailableSlots, getDoctorDetail } from "../util/api";

const DoctorDetailPage = () => {
    const { slugOrId } = useParams();
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [slots, setSlots] = useState([]);
    const [bookingQuantity, setBookingQuantity] = useState(1);

    useEffect(() => {
        let active = true;

        getDoctorDetail(slugOrId)
            .then((res) => {
                if (active && res.data?.success) {
                    setDoctor(res.data.item);
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
            }
        });
    }, [selectedDate, slugOrId]);

    const activeImage = useMemo(() => doctor?.gallery?.[activeImageIndex] || doctor?.image, [doctor, activeImageIndex]);

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
                            <button
                                type="button"
                                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? doctor.gallery.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
                            >
                                <LeftOutlined />
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveImageIndex((prev) => (prev === doctor.gallery.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm"
                            >
                                <RightOutlined />
                            </button>
                        </div>

                        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                            {doctor.gallery.map((image, index) => (
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
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Slot còn trống</p>
                                <p className="mt-2 text-2xl font-bold text-slate-950">{doctor.availableSlotsToday}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 px-4 py-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Kinh nghiệm</p>
                                <p className="mt-2 text-2xl font-bold text-slate-950">{doctor.experienceYears} năm</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-slate-900">Số hồ sơ cần đặt cùng lúc</p>
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

                        <div className="mt-6">
                            <label className="text-sm font-semibold text-slate-900">Tra cứu slot còn trống</label>
                            <div className="mt-3 flex items-center gap-3">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(event) => setSelectedDate(event.target.value)}
                                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                                />
                                <Link to="/doctors" className="inline-flex items-center gap-2 rounded-2xl bg-[#0092b8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#007da0]">
                                    <CalendarOutlined />
                                    <span>Đặt lịch khám</span>
                                </Link>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3">
                                {slots.length > 0 ? slots.map((slot) => (
                                    <span key={slot.startTime} className="rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-[#0092b8]">
                                        {slot.startTime} - {slot.endTime}
                                    </span>
                                )) : (
                                    <span className="text-sm text-slate-500">Ngày đã chọn hiện chưa có slot trống.</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-slate-900">Thông tin thêm</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {doctor.highlights.map((item) => (
                                    <span key={item} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

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
    );
};

export default DoctorDetailPage;

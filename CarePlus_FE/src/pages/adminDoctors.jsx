import { DeleteOutlined, EditOutlined, EyeOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import {
    createAdminDoctor,
    deleteAdminDoctor,
    getAdminDoctors,
    getAdminSpecialties,
    updateAdminDoctor,
} from "../util/api";

const createEmptyForm = () => ({
    fullName: "",
    title: "",
    specialtyId: "",
    gender: "OTHER",
    experienceYears: 0,
    consultationFee: 0,
    rating: 4.5,
    bookedCount: 0,
    availableSlotsToday: 0,
    image: "",
    bio: "",
    highlights: "",
    gallery: "",
    isFeatured: false,
    isTopBooked: false,
    isActive: true,
});

const formatMoney = (amount) => {
    return `${new Intl.NumberFormat("vi-VN").format(amount || 0)} đ`;
};

const AdminDoctorsPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [query, setQuery] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [form, setForm] = useState(createEmptyForm());
    const [errors, setErrors] = useState({});

    const loadDependencies = async () => {
        setLoading(true);
        try {
            const [doctorRes, specialtyRes] = await Promise.all([
                getAdminDoctors({ search: query }),
                getAdminSpecialties(),
            ]);
            setDoctors(doctorRes.data?.items || []);
            setSpecialties(specialtyRes.data?.items || []);
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể tải dữ liệu bác sĩ.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const bootstrap = async () => {
            if (!isMounted) {
                return;
            }

            setLoading(true);
            try {
                const [doctorRes, specialtyRes] = await Promise.all([
                    getAdminDoctors({ search: "" }),
                    getAdminSpecialties(),
                ]);
                if (!isMounted) {
                    return;
                }
                setDoctors(doctorRes.data?.items || []);
                setSpecialties(specialtyRes.data?.items || []);
            } catch (error) {
                if (isMounted) {
                    messageApi.error(error.response?.data?.message || "Không thể tải dữ liệu bác sĩ.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void bootstrap();

        return () => {
            isMounted = false;
        };
    }, [messageApi]);

    const filteredDoctors = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        if (!keyword) {
            return doctors;
        }

        return doctors.filter((doctor) =>
            `${doctor.fullName} ${doctor.specialtyName} ${doctor.title}`.toLowerCase().includes(keyword)
        );
    }, [doctors, query]);

    const resetForm = () => {
        setSelectedItem(null);
        setForm(createEmptyForm());
        setErrors({});
    };

    const hydrateForm = (doctor) => {
        setSelectedItem(doctor);
        setErrors({});
        setForm({
            fullName: doctor.fullName || "",
            title: doctor.title || "",
            specialtyId: doctor.specialtyId ? String(doctor.specialtyId) : "",
            gender: doctor.gender || "OTHER",
            experienceYears: doctor.experienceYears || 0,
            consultationFee: doctor.consultationFee || 0,
            rating: doctor.rating || 0,
            bookedCount: doctor.bookedCount || 0,
            availableSlotsToday: doctor.availableSlotsToday || 0,
            image: doctor.image || "",
            bio: doctor.bio || "",
            highlights: Array.isArray(doctor.highlights) ? doctor.highlights.join("\n") : "",
            gallery: Array.isArray(doctor.gallery) ? doctor.gallery.join("\n") : "",
            isFeatured: Boolean(doctor.isFeatured),
            isTopBooked: Boolean(doctor.isTopBooked),
            isActive: doctor.isActive !== false,
        });
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.fullName.trim()) {
            nextErrors.fullName = "Tên bác sĩ là bắt buộc.";
        }
        if (!form.title.trim()) {
            nextErrors.title = "Chức danh là bắt buộc.";
        }
        if (!form.specialtyId) {
            nextErrors.specialtyId = "Vui lòng chọn chuyên khoa.";
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const buildPayload = () => ({
        ...form,
        specialtyId: Number(form.specialtyId),
        highlights: form.highlights,
        gallery: form.gallery,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        setSaving(true);
        try {
            if (selectedItem) {
                await updateAdminDoctor(selectedItem.id, buildPayload());
                messageApi.success("Cập nhật bác sĩ thành công.");
            } else {
                await createAdminDoctor(buildPayload());
                messageApi.success("Tạo bác sĩ thành công.");
            }

            resetForm();
            await loadDependencies();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể lưu bác sĩ.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (doctor) => {
        const confirmed = window.confirm(`Xóa bác sĩ "${doctor.fullName}"?`);
        if (!confirmed) {
            return;
        }

        setDeletingId(doctor.id);
        try {
            await deleteAdminDoctor(doctor.id);
            messageApi.success("Xóa bác sĩ thành công.");
            if (selectedItem?.id === doctor.id) {
                resetForm();
            }
            await loadDependencies();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể xóa bác sĩ.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            {contextHolder}
            <AdminLayout
                title="Quản lý bác sĩ"
                description="Quản lý hồ sơ hiển thị của bác sĩ, giá khám tham khảo, số lượt đặt và trạng thái xuất hiện trên hệ thống."
                activeKey="doctors"
                actions={
                    <>
                        <button
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
                            onClick={() => loadDependencies()}
                            type="button"
                        >
                            <ReloadOutlined />
                            Tải lại
                        </button>
                        <button
                            className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-cyan-700"
                            onClick={resetForm}
                            type="button"
                        >
                            <PlusOutlined />
                            Thêm bác sĩ
                        </button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        Giá khám tham khảo chỉ dùng để hiển thị cho bệnh nhân. Hệ thống hiện chưa xử lý thanh toán trực tuyến.
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
                        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Danh sách bác sĩ</h2>
                                    <p className="mt-1 text-sm text-slate-500">{filteredDoctors.length} hồ sơ hiển thị trong bảng</p>
                                </div>
                                <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
                                    <SearchOutlined />
                                    <input
                                        className="w-64 bg-transparent outline-none placeholder:text-slate-400"
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="Tìm bác sĩ hoặc chuyên khoa"
                                        value={query}
                                    />
                                </label>
                            </div>

                            {loading ? (
                                <div className="flex min-h-[320px] items-center justify-center gap-3 text-slate-500">
                                    <LoadingOutlined className="text-xl text-cyan-600" />
                                    <span>Đang tải dữ liệu bác sĩ...</span>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-[24px] border border-slate-100">
                                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                                        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Bác sĩ</th>
                                                <th className="px-4 py-3">Chuyên khoa</th>
                                                <th className="px-4 py-3">Kinh nghiệm</th>
                                                <th className="px-4 py-3">Giá khám</th>
                                                <th className="px-4 py-3">Đánh giá</th>
                                                <th className="px-4 py-3">Trạng thái</th>
                                                <th className="px-4 py-3">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {!filteredDoctors.length ? (
                                                <tr>
                                                    <td className="px-4 py-10 text-center text-slate-500" colSpan="7">
                                                        Không có bác sĩ phù hợp.
                                                    </td>
                                                </tr>
                                            ) : null}
                                            {filteredDoctors.map((doctor) => (
                                                <tr key={doctor.id} className={selectedItem?.id === doctor.id ? "bg-cyan-50/50" : ""}>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                alt={doctor.fullName}
                                                                className="h-10 w-10 rounded-2xl object-cover"
                                                                src={doctor.image}
                                                            />
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{doctor.fullName}</p>
                                                                <p className="text-xs text-slate-500">{doctor.title}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-600">{doctor.specialtyName}</td>
                                                    <td className="px-4 py-4 text-slate-600">{doctor.experienceYears} năm</td>
                                                    <td className="px-4 py-4 font-semibold text-cyan-700">
                                                        {formatMoney(doctor.consultationFee)}
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-600">⭐ {doctor.rating}</td>
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                                doctor.isActive !== false
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-slate-200 text-slate-600"
                                                            }`}
                                                        >
                                                            {doctor.isActive !== false ? "Hoạt động" : "Đang ẩn"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                                                                onClick={() => hydrateForm(doctor)}
                                                                type="button"
                                                            >
                                                                <EditOutlined />
                                                            </button>
                                                            <button
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
                                                                onClick={() => window.open(`/doctors/${doctor.slug || doctor.id}`, "_blank")}
                                                                type="button"
                                                            >
                                                                <EyeOutlined />
                                                            </button>
                                                            <button
                                                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                                                disabled={deletingId === doctor.id}
                                                                onClick={() => handleDelete(doctor)}
                                                                type="button"
                                                            >
                                                                {deletingId === doctor.id ? <LoadingOutlined /> : <DeleteOutlined />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {selectedItem ? `Chỉnh sửa #${selectedItem.id}` : "Thêm bác sĩ"}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Quản lý hồ sơ công khai của bác sĩ, thông tin hiển thị và dữ liệu tham khảo.
                                </p>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Họ tên bác sĩ</label>
                                    <input
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                                        value={form.fullName}
                                    />
                                    {errors.fullName ? <p className="mt-2 text-sm text-rose-600">{errors.fullName}</p> : null}
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Chức danh</label>
                                    <input
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                                        value={form.title}
                                    />
                                    {errors.title ? <p className="mt-2 text-sm text-rose-600">{errors.title}</p> : null}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Chuyên khoa</label>
                                        <select
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                            onChange={(event) => setForm((prev) => ({ ...prev, specialtyId: event.target.value }))}
                                            value={form.specialtyId}
                                        >
                                            <option value="">Chọn chuyên khoa</option>
                                            {specialties.map((item) => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                        {errors.specialtyId ? <p className="mt-2 text-sm text-rose-600">{errors.specialtyId}</p> : null}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Giới tính</label>
                                        <select
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                            onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                                            value={form.gender}
                                        >
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Kinh nghiệm</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                            min="0"
                                            onChange={(event) => setForm((prev) => ({ ...prev, experienceYears: Number(event.target.value) || 0 }))}
                                            type="number"
                                            value={form.experienceYears}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Giá khám tham khảo</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                            min="0"
                                            onChange={(event) => setForm((prev) => ({ ...prev, consultationFee: Number(event.target.value) || 0 }))}
                                            type="number"
                                            value={form.consultationFee}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Đánh giá</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                            max="5"
                                            min="0"
                                            onChange={(event) => setForm((prev) => ({ ...prev, rating: Number(event.target.value) || 0 }))}
                                            step="0.1"
                                            type="number"
                                            value={form.rating}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Lượt đặt</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                            min="0"
                                            onChange={(event) => setForm((prev) => ({ ...prev, bookedCount: Number(event.target.value) || 0 }))}
                                            type="number"
                                            value={form.bookedCount}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">Slot còn trống hôm nay</label>
                                        <input
                                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                            min="0"
                                            onChange={(event) => setForm((prev) => ({ ...prev, availableSlotsToday: Number(event.target.value) || 0 }))}
                                            type="number"
                                            value={form.availableSlotsToday}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Ảnh đại diện</label>
                                    <input
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                                        placeholder="https://..."
                                        value={form.image}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Mô tả giới thiệu</label>
                                    <textarea
                                        className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                                        value={form.bio}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Điểm nổi bật</label>
                                    <textarea
                                        className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        onChange={(event) => setForm((prev) => ({ ...prev, highlights: event.target.value }))}
                                        placeholder="Mỗi dòng là một điểm nổi bật"
                                        value={form.highlights}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Thư viện ảnh</label>
                                    <textarea
                                        className="min-h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        onChange={(event) => setForm((prev) => ({ ...prev, gallery: event.target.value }))}
                                        placeholder="Mỗi dòng là một URL ảnh"
                                        value={form.gallery}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                                        <input
                                            checked={form.isFeatured}
                                            onChange={(event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))}
                                            type="checkbox"
                                        />
                                        Đưa vào nhóm bác sĩ nổi bật
                                    </label>
                                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                                        <input
                                            checked={form.isTopBooked}
                                            onChange={(event) => setForm((prev) => ({ ...prev, isTopBooked: event.target.checked }))}
                                            type="checkbox"
                                        />
                                        Đưa vào nhóm được đặt nhiều
                                    </label>
                                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                                        <input
                                            checked={form.isActive}
                                            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                                            type="checkbox"
                                        />
                                        Hiển thị bác sĩ ở khu vực công khai
                                    </label>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3">
                                    <button
                                        className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                        onClick={resetForm}
                                        type="button"
                                    >
                                        Đặt lại
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-60"
                                        disabled={saving}
                                        type="submit"
                                    >
                                        {saving ? <LoadingOutlined /> : <SaveOutlined />}
                                        {selectedItem ? "Lưu thay đổi" : "Tạo bác sĩ"}
                                    </button>
                                </div>
                            </form>
                        </aside>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
};

export default AdminDoctorsPage;

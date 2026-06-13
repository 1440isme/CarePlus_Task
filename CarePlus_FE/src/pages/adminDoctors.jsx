import {
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
    PlusOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import { createAdminDoctor, deleteAdminDoctor, getAdminDoctors, updateAdminDoctor } from "../util/api";

const emptyForm = {
    fullName: "",
    title: "",
    specialtyId: 1,
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
};

const feeLabel = (value) => `${Math.round((Number(value) || 0) / 1000)}K`;

const AdminDoctorsPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const loadDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminDoctors();
            setDoctors(res.data?.items || []);
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể tải danh sách bác sĩ.");
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadDoctors();
    }, [loadDoctors]);

    const editingDoctor = useMemo(
        () => doctors.find((item) => String(item.id) === String(editing)),
        [doctors, editing],
    );

    const startCreate = () => {
        setEditing("new");
        setForm(emptyForm);
    };

    const startEdit = (doctor) => {
        setEditing(doctor.id);
        setForm({
            ...emptyForm,
            ...doctor,
            specialtyId: doctor.specialtyId || 1,
            highlights: Array.isArray(doctor.highlights) ? doctor.highlights.join("\n") : "",
            gallery: Array.isArray(doctor.gallery) ? doctor.gallery.join("\n") : "",
        });
    };

    const submit = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                highlights: form.highlights,
                gallery: form.gallery,
            };
            if (editing === "new") {
                await createAdminDoctor(payload);
                messageApi.success("Đã tạo bác sĩ.");
            } else if (editingDoctor) {
                await updateAdminDoctor(editingDoctor.id, payload);
                messageApi.success("Đã cập nhật bác sĩ.");
            }
            setEditing(null);
            setForm(emptyForm);
            await loadDoctors();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể lưu bác sĩ.");
        } finally {
            setSaving(false);
        }
    };

    const removeDoctor = async (doctor) => {
        if (!window.confirm(`Xóa bác sĩ "${doctor.fullName}"?`)) return;
        setDeletingId(doctor.id);
        try {
            await deleteAdminDoctor(doctor.id);
            messageApi.success("Đã xóa bác sĩ.");
            await loadDoctors();
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
                title="Bác sĩ admin"
                activeKey="doctors"
                actions={
                    <div className="flex gap-2">
                        <button
                            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600 hover:bg-slate-200"
                            onClick={() => loadDoctors()}
                            type="button"
                        >
                            <ReloadOutlined />
                            Tải lại
                        </button>
                        <button
                            className="inline-flex items-center gap-1 rounded bg-cyan-500 px-2.5 py-1 text-[10px] font-medium text-white hover:bg-cyan-600"
                            onClick={startCreate}
                            type="button"
                        >
                            <PlusOutlined />
                            Thêm bác sĩ
                        </button>
                    </div>
                }
            >
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-[18px] font-semibold text-slate-800">Quản lý bác sĩ</h1>
                    </div>

                    <div className="mb-3 rounded border border-amber-100 bg-amber-50 px-3 py-2 text-[10px] text-amber-700">
                        Dữ liệu khám hiển thị ở đây để phục vụ bệnh nhân. Hãy đồng bộ thông tin kỹ trước khi bật hiển thị.
                    </div>

                    <div className="overflow-hidden rounded border border-slate-100 bg-white">
                        {loading ? (
                            <div className="flex min-h-[320px] items-center justify-center gap-2 text-xs text-slate-500">
                                <LoadingOutlined className="text-cyan-500" />
                                Đang tải dữ liệu...
                            </div>
                        ) : (
                            <table className="min-w-full text-left text-[10px]">
                                <thead className="border-b border-slate-100 bg-slate-50 text-slate-400">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">Bác sĩ</th>
                                        <th className="px-3 py-2 font-medium">Chuyên khoa</th>
                                        <th className="px-3 py-2 font-medium">Kinh nghiệm</th>
                                        <th className="px-3 py-2 font-medium">Giá khám ban đầu</th>
                                        <th className="px-3 py-2 font-medium">Đánh giá</th>
                                        <th className="px-3 py-2 font-medium">Trạng thái</th>
                                        <th className="px-3 py-2 font-medium">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((doctor) => (
                                        <tr key={doctor.id} className="border-b border-slate-50">
                                            <td className="px-3 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <img alt={doctor.fullName} className="h-6 w-6 rounded-full object-cover" src={doctor.image} />
                                                    <div>
                                                        <p className="font-semibold text-slate-700">{doctor.fullName}</p>
                                                        <p className="text-[9px] text-slate-400">{doctor.title}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2 text-slate-500">{doctor.specialtyName}</td>
                                            <td className="px-3 py-2 text-slate-500">{doctor.experienceYears} năm</td>
                                            <td className="px-3 py-2 font-semibold text-sky-500">{feeLabel(doctor.consultationFee)}</td>
                                            <td className="px-3 py-2 text-amber-500">★ {doctor.rating} ({doctor.bookedCount})</td>
                                            <td className="px-3 py-2">
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] text-emerald-600">
                                                    {doctor.isActive !== false ? "Hoạt động" : "Đang ẩn"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <button onClick={() => startEdit(doctor)} type="button">
                                                        <EditOutlined />
                                                    </button>
                                                    <button disabled={deletingId === doctor.id} onClick={() => removeDoctor(doctor)} type="button">
                                                        {deletingId === doctor.id ? <LoadingOutlined /> : <DeleteOutlined />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {editing ? (
                        <div className="mt-4 rounded border border-slate-100 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-[12px] font-semibold text-slate-700">
                                    {editing === "new" ? "Tạo bác sĩ mới" : `Chỉnh sửa ${editingDoctor?.fullName || ""}`}
                                </h2>
                                <div className="flex gap-2">
                                    <button className="rounded bg-slate-100 px-2 py-1 text-[10px] text-slate-600" onClick={() => setEditing(null)} type="button">
                                        Hủy
                                    </button>
                                    <button
                                        className="rounded bg-cyan-500 px-2 py-1 text-[10px] text-white disabled:opacity-60"
                                        disabled={saving}
                                        onClick={submit}
                                        type="button"
                                    >
                                        {saving ? "Đang lưu..." : "Lưu bác sĩ"}
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-3">
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Họ tên" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Chức danh" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Ảnh URL" value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Kinh nghiệm" type="number" value={form.experienceYears} onChange={(e) => setForm((p) => ({ ...p, experienceYears: Number(e.target.value) || 0 }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Giá khám" type="number" value={form.consultationFee} onChange={(e) => setForm((p) => ({ ...p, consultationFee: Number(e.target.value) || 0 }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Đánh giá" type="number" step="0.1" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) || 0 }))} />
                            </div>
                        </div>
                    ) : null}
                </div>
            </AdminLayout>
        </>
    );
};

export default AdminDoctorsPage;

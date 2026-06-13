import {
    DeleteOutlined,
    EditOutlined,
    LoadingOutlined,
    PlusOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import { createAdminSpecialty, deleteAdminSpecialty, getAdminSpecialties, updateAdminSpecialty } from "../util/api";

const emptyForm = {
    name: "",
    summary: "",
    description: "",
    icon: "🩺",
    color: "from-sky-50 to-cyan-50",
    popularityRank: 1,
    coverImage: "",
    isActive: true,
};

const AdminSpecialtiesPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [items, setItems] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const loadItems = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminSpecialties();
            setItems(res.data?.items || []);
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể tải danh sách chuyên khoa.");
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadItems();
    }, [loadItems]);

    const startCreate = () => {
        setEditing("new");
        setForm(emptyForm);
    };

    const startEdit = (item) => {
        setEditing(item.id);
        setForm({ ...emptyForm, ...item });
    };

    const submit = async () => {
        setSaving(true);
        try {
            if (editing === "new") {
                await createAdminSpecialty(form);
                messageApi.success("Đã tạo chuyên khoa.");
            } else {
                await updateAdminSpecialty(editing, form);
                messageApi.success("Đã cập nhật chuyên khoa.");
            }
            setEditing(null);
            setForm(emptyForm);
            await loadItems();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể lưu chuyên khoa.");
        } finally {
            setSaving(false);
        }
    };

    const removeItem = async (item) => {
        if (!window.confirm(`Xóa chuyên khoa "${item.name}"?`)) return;
        setDeletingId(item.id);
        try {
            await deleteAdminSpecialty(item.id);
            messageApi.success("Đã xóa chuyên khoa.");
            await loadItems();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể xóa chuyên khoa.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            {contextHolder}
            <AdminLayout
                title="Chuyên khoa admin"
                activeKey="specialties"
                actions={
                    <div className="flex gap-2">
                        <button
                            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600 hover:bg-slate-200"
                            onClick={() => loadItems()}
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
                            Thêm chuyên khoa
                        </button>
                    </div>
                }
            >
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-[18px] font-semibold text-slate-800">Quản lý chuyên khoa</h1>
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
                                        <th className="px-3 py-2 font-medium">Tên chuyên khoa</th>
                                        <th className="px-3 py-2 font-medium">Mô tả</th>
                                        <th className="px-3 py-2 font-medium">Số bác sĩ</th>
                                        <th className="px-3 py-2 font-medium">Trạng thái</th>
                                        <th className="px-3 py-2 font-medium">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50">
                                            <td className="px-3 py-2.5 font-semibold text-slate-700">{item.name}</td>
                                            <td className="px-3 py-2 text-slate-500">{item.summary}</td>
                                            <td className="px-3 py-2 text-slate-500">{item.doctorCount || 0}</td>
                                            <td className="px-3 py-2">
                                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] text-emerald-600">
                                                    {item.isActive !== false ? "Hoạt động" : "Đang ẩn"}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <button onClick={() => startEdit(item)} type="button">
                                                        <EditOutlined />
                                                    </button>
                                                    <button disabled={deletingId === item.id} onClick={() => removeItem(item)} type="button">
                                                        {deletingId === item.id ? <LoadingOutlined /> : <DeleteOutlined />}
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
                                    {editing === "new" ? "Tạo chuyên khoa mới" : `Chỉnh sửa ${form.name}`}
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
                                        {saving ? "Đang lưu..." : "Lưu chuyên khoa"}
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Tên chuyên khoa" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Icon" value={form.icon} onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px] md:col-span-2" placeholder="Mô tả ngắn" value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))} />
                                <textarea className="min-h-20 rounded border border-slate-200 px-2 py-2 text-[10px] md:col-span-2" placeholder="Mô tả chi tiết" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                            </div>
                        </div>
                    ) : null}
                </div>
            </AdminLayout>
        </>
    );
};

export default AdminSpecialtiesPage;

import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import {
    createAdminSpecialty,
    deleteAdminSpecialty,
    getAdminSpecialties,
    updateAdminSpecialty,
} from "../util/api";

const createEmptyForm = () => ({
    name: "",
    summary: "",
    description: "",
    icon: "🩺",
    color: "from-sky-50 to-cyan-50",
    popularityRank: 1,
    coverImage: "",
    isActive: true,
});

const AdminSpecialtiesPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [query, setQuery] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [form, setForm] = useState(createEmptyForm());
    const [errors, setErrors] = useState({});

    const loadSpecialties = async () => {
        setLoading(true);
        try {
            const res = await getAdminSpecialties({ search: query });
            const nextItems = res.data?.items || [];
            setSpecialties(nextItems);

            if (selectedItem) {
                const refreshed = nextItems.find((item) => String(item.id) === String(selectedItem.id));
                if (refreshed) {
                    setSelectedItem(refreshed);
                    setForm({
                        name: refreshed.name || "",
                        summary: refreshed.summary || "",
                        description: refreshed.description || "",
                        icon: refreshed.icon || "🩺",
                        color: refreshed.color || "from-sky-50 to-cyan-50",
                        popularityRank: refreshed.popularityRank || 1,
                        coverImage: refreshed.coverImage || "",
                        isActive: refreshed.isActive !== false,
                    });
                }
            }
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể tải danh sách chuyên khoa.");
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
                const res = await getAdminSpecialties({ search: "" });
                if (!isMounted) {
                    return;
                }
                setSpecialties(res.data?.items || []);
            } catch (error) {
                if (isMounted) {
                    messageApi.error(error.response?.data?.message || "Không thể tải danh sách chuyên khoa.");
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

    const filteredItems = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        if (!keyword) {
            return specialties;
        }

        return specialties.filter((item) =>
            `${item.name} ${item.summary} ${item.description}`.toLowerCase().includes(keyword)
        );
    }, [query, specialties]);

    const resetForm = () => {
        setSelectedItem(null);
        setForm(createEmptyForm());
        setErrors({});
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setErrors({});
        setForm({
            name: item.name || "",
            summary: item.summary || "",
            description: item.description || "",
            icon: item.icon || "🩺",
            color: item.color || "from-sky-50 to-cyan-50",
            popularityRank: item.popularityRank || 1,
            coverImage: item.coverImage || "",
            isActive: item.isActive !== false,
        });
    };

    const validate = () => {
        const nextErrors = {};
        if (!form.name.trim()) {
            nextErrors.name = "Tên chuyên khoa là bắt buộc.";
        }
        if (!form.summary.trim()) {
            nextErrors.summary = "Mô tả ngắn là bắt buộc.";
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) {
            return;
        }

        setSaving(true);
        try {
            if (selectedItem) {
                await updateAdminSpecialty(selectedItem.id, form);
                messageApi.success("Cập nhật chuyên khoa thành công.");
            } else {
                await createAdminSpecialty(form);
                messageApi.success("Tạo chuyên khoa thành công.");
            }

            resetForm();
            await loadSpecialties();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể lưu chuyên khoa.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item) => {
        const confirmed = window.confirm(`Xóa chuyên khoa "${item.name}"?`);
        if (!confirmed) {
            return;
        }

        setDeletingId(item.id);
        try {
            await deleteAdminSpecialty(item.id);
            messageApi.success("Xóa chuyên khoa thành công.");
            if (selectedItem && String(selectedItem.id) === String(item.id)) {
                resetForm();
            }
            await loadSpecialties();
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
                title="Quản lý chuyên khoa"
                description="Quản lý danh mục chuyên khoa hiển thị ở trang công khai, mô tả giới thiệu và mức độ ưu tiên."
                activeKey="specialties"
                actions={
                    <>
                        <button
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
                            onClick={() => loadSpecialties()}
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
                            Thêm chuyên khoa
                        </button>
                    </>
                }
            >
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Danh sách chuyên khoa</h2>
                                <p className="mt-1 text-sm text-slate-500">{filteredItems.length} mục đang hiển thị trong bảng</p>
                            </div>
                            <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
                                <SearchOutlined />
                                <input
                                    className="w-64 bg-transparent outline-none placeholder:text-slate-400"
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Tìm tên hoặc mô tả chuyên khoa"
                                    value={query}
                                />
                            </label>
                        </div>

                        {loading ? (
                            <div className="flex min-h-[320px] items-center justify-center gap-3 text-slate-500">
                                <LoadingOutlined className="text-xl text-cyan-600" />
                                <span>Đang tải dữ liệu chuyên khoa...</span>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-[24px] border border-slate-100">
                                <table className="min-w-full divide-y divide-slate-100 text-sm">
                                    <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">Chuyên khoa</th>
                                            <th className="px-4 py-3">Bác sĩ</th>
                                            <th className="px-4 py-3">Ưu tiên</th>
                                            <th className="px-4 py-3">Trạng thái</th>
                                            <th className="px-4 py-3">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {!filteredItems.length ? (
                                            <tr>
                                                <td className="px-4 py-10 text-center text-slate-500" colSpan="5">
                                                    Không có chuyên khoa phù hợp.
                                                </td>
                                            </tr>
                                        ) : null}
                                        {filteredItems.map((item) => (
                                            <tr key={item.id} className={selectedItem?.id === item.id ? "bg-cyan-50/50" : ""}>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-xl">
                                                            {item.icon || "🩺"}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{item.name}</p>
                                                            <p className="mt-1 line-clamp-2 max-w-sm text-xs text-slate-500">{item.summary}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-slate-600">{item.doctorCount || 0}</td>
                                                <td className="px-4 py-4 text-slate-600">{item.popularityRank || "—"}</td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                            item.isActive !== false
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-slate-200 text-slate-600"
                                                        }`}
                                                    >
                                                        {item.isActive !== false ? "Hoạt động" : "Đang ẩn"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                                                            onClick={() => handleEdit(item)}
                                                            type="button"
                                                        >
                                                            <EditOutlined />
                                                        </button>
                                                        <button
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                                            disabled={deletingId === item.id}
                                                            onClick={() => handleDelete(item)}
                                                            type="button"
                                                        >
                                                            {deletingId === item.id ? <LoadingOutlined /> : <DeleteOutlined />}
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
                                {selectedItem ? `Chỉnh sửa #${selectedItem.id}` : "Thêm chuyên khoa"}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Cập nhật tên hiển thị, mô tả và trạng thái cho từng chuyên khoa.
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Tên chuyên khoa</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                    value={form.name}
                                />
                                {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name}</p> : null}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Mô tả ngắn</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                    onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                                    value={form.summary}
                                />
                                {errors.summary ? <p className="mt-2 text-sm text-rose-600">{errors.summary}</p> : null}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Mô tả chi tiết</label>
                                <textarea
                                    className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                                    value={form.description}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Biểu tượng</label>
                                    <input
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}
                                        value={form.icon}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Ưu tiên hiển thị</label>
                                    <input
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                        min="1"
                                        onChange={(event) => setForm((prev) => ({ ...prev, popularityRank: Number(event.target.value) || 1 }))}
                                        type="number"
                                        value={form.popularityRank}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Gradient màu</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                    onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
                                    placeholder="from-sky-50 to-cyan-50"
                                    value={form.color}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Ảnh bìa</label>
                                <input
                                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-300"
                                    onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))}
                                    placeholder="https://..."
                                    value={form.coverImage}
                                />
                            </div>

                            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                                <input
                                    checked={form.isActive}
                                    onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                                    type="checkbox"
                                />
                                Hiển thị chuyên khoa này ở trang công khai
                            </label>

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
                                    {selectedItem ? "Lưu thay đổi" : "Tạo chuyên khoa"}
                                </button>
                            </div>
                        </form>
                    </aside>
                </div>
            </AdminLayout>
        </>
    );
};

export default AdminSpecialtiesPage;

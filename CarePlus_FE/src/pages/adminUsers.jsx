import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import {
    createAdminUser,
    deleteAdminUser,
    getAdminUsers,
    resetAdminUserNoShow,
    toggleAdminUserBookingLock,
    toggleAdminUserLock,
    updateAdminUser,
} from "../util/api";

const emptyForm = {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    gender: "",
    phone: "",
    avatar: "",
    role: "user",
    isActive: "true",
    isLocked: "false",
};

const roleLabel = (role) => {
    if (role === "admin") return { text: "Admin", className: "bg-violet-50 text-violet-600" };
    return { text: "Bệnh nhân", className: "bg-sky-50 text-sky-600" };
};

const AdminUsersPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [users, setUsers] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminUsers();
            setUsers(res.data?.items || []);
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể tải danh sách người dùng.");
        } finally {
            setLoading(false);
        }
    }, [messageApi]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void loadUsers();
    }, [loadUsers]);

    const startCreate = () => {
        setEditing("new");
        setForm(emptyForm);
    };

    const startEdit = (user) => {
        setEditing(user.id);
        setForm({
            ...emptyForm,
            ...user,
            role: user.role || "user",
            isActive: String(user.isActive ?? true),
            isLocked: String(user.isLocked ?? false),
        });
    };

    const submit = async () => {
        setSaving(true);
        try {
            if (editing === "new") {
                await createAdminUser(form);
                messageApi.success("Đã tạo tài khoản.");
            } else {
                await updateAdminUser(editing, form);
                messageApi.success("Đã cập nhật tài khoản.");
            }
            setEditing(null);
            setForm(emptyForm);
            await loadUsers();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể lưu tài khoản.");
        } finally {
            setSaving(false);
        }
    };

    const removeUser = async (user) => {
        if (!window.confirm(`Xóa tài khoản ${user.email}?`)) return;
        try {
            await deleteAdminUser(user.id);
            messageApi.success("Đã xóa tài khoản.");
            await loadUsers();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể xóa tài khoản.");
        }
    };

    const runAction = async (task, successMessage) => {
        try {
            await task();
            messageApi.success(successMessage);
            await loadUsers();
        } catch (error) {
            messageApi.error(error.response?.data?.message || "Không thể cập nhật người dùng.");
        }
    };

    return (
        <>
            {contextHolder}
            <AdminLayout
                title="Người dùng admin"
                activeKey="users"
                actions={
                    <div className="flex gap-2">
                        <button
                            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600 hover:bg-slate-200"
                            onClick={() => loadUsers()}
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
                            Tạo tài khoản nhân sự
                        </button>
                    </div>
                }
            >
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-[18px] font-semibold text-slate-800">Quản lý người dùng</h1>
                    </div>

                    <div className="mb-3 flex gap-3">
                        <div className="h-10 w-24 rounded border border-slate-100 bg-white" />
                        <div className="h-10 w-10 rounded border border-slate-100 bg-white" />
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
                                        <th className="px-3 py-2 font-medium">Người dùng</th>
                                        <th className="px-3 py-2 font-medium">Vai trò</th>
                                        <th className="px-3 py-2 font-medium">No-show</th>
                                        <th className="px-3 py-2 font-medium">Trạng thái</th>
                                        <th className="px-3 py-2 font-medium">Ngày tạo</th>
                                        <th className="px-3 py-2 font-medium">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => {
                                        const role = roleLabel(user.role);
                                        return (
                                            <tr key={user.id} className="border-b border-slate-50">
                                                <td className="px-3 py-2.5">
                                                    <p className="font-semibold text-slate-700">
                                                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.username}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400">{user.email}</p>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <span className={`rounded-full px-2 py-0.5 text-[9px] ${role.className}`}>{role.text}</span>
                                                </td>
                                                <td className="px-3 py-2 text-rose-500">{user.patientProfile?.noShowCount || 0}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`rounded-full px-2 py-0.5 text-[9px] ${user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                                                        {user.isActive ? "Hoạt động" : "Bị khóa"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-slate-500">{user.createdAt?.slice?.(0, 10) || "—"}</td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <button
                                                            className="rounded bg-rose-500 px-1.5 py-0.5 text-[8px] text-white"
                                                            onClick={() => runAction(() => toggleAdminUserLock(user.id, !user.isLocked), "Đã cập nhật khóa tài khoản.")}
                                                            type="button"
                                                        >
                                                            {user.isLocked ? "Mở khóa TK" : "Khóa TK"}
                                                        </button>
                                                        {user.role === "user" ? (
                                                            <>
                                                                <button
                                                                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[8px] text-slate-600"
                                                                    onClick={() => runAction(() => resetAdminUserNoShow(user.id), "Đã reset no-show.")}
                                                                    type="button"
                                                                >
                                                                    Reset no-show
                                                                </button>
                                                                <button
                                                                    className="rounded bg-sky-100 px-1.5 py-0.5 text-[8px] text-sky-600"
                                                                    onClick={() =>
                                                                        runAction(
                                                                            () => toggleAdminUserBookingLock(user.id, { locked: !user.patientProfile?.bookingLocked }),
                                                                            "Đã cập nhật quyền đặt lịch.",
                                                                        )
                                                                    }
                                                                    type="button"
                                                                >
                                                                    {user.patientProfile?.bookingLocked ? "Mở khóa đặt lịch" : "Khóa đặt lịch"}
                                                                </button>
                                                            </>
                                                        ) : null}
                                                        <button className="text-slate-400" onClick={() => startEdit(user)} type="button">
                                                            <EditOutlined />
                                                        </button>
                                                        <button className="text-slate-400" onClick={() => removeUser(user)} type="button">
                                                            <DeleteOutlined />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {editing ? (
                        <div className="mt-4 rounded border border-slate-100 bg-white p-3">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-[12px] font-semibold text-slate-700">
                                    {editing === "new" ? "Tạo người dùng mới" : `Chỉnh sửa ${form.email}`}
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
                                        {saving ? "Đang lưu..." : "Lưu tài khoản"}
                                    </button>
                                </div>
                            </div>
                            <div className="grid gap-3 md:grid-cols-3">
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Username" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                                <input className="rounded border border-slate-200 px-2 py-2 text-[10px]" placeholder="Mật khẩu" type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
                            </div>
                        </div>
                    ) : null}
                </div>
            </AdminLayout>
        </>
    );
};

export default AdminUsersPage;

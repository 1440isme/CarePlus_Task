import { ArrowRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import AdminLayout from "../components/admin/AdminLayout";
import { getAdminDashboard } from "../util/api";

const formatNumber = (value) => {
    if (typeof value !== "number") {
        return value;
    }

    return new Intl.NumberFormat("vi-VN").format(value);
};

const AdminDashboardPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const bootstrap = async () => {
            setLoading(true);
            try {
                const res = await getAdminDashboard();
                if (isMounted) {
                    setDashboard(res.data?.data || null);
                }
            } catch (error) {
                if (isMounted) {
                    messageApi.error(error.response?.data?.message || "Không thể tải dữ liệu tổng quan.");
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

    return (
        <>
            {contextHolder}
            <AdminLayout
                title="Trang chủ quản trị"
                description="Theo dõi nhanh quy mô dữ liệu, hiệu suất hiển thị và các nhóm nội dung đang xuất hiện trên hệ thống CarePlus."
                activeKey="dashboard"
            >
                {loading ? (
                    <div className="flex min-h-[40vh] items-center justify-center gap-3 rounded-[28px] border border-slate-200 bg-white text-slate-500 shadow-sm">
                        <LoadingOutlined className="text-2xl text-cyan-600" />
                        <span>Đang tải dữ liệu quản trị...</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            {dashboard?.stats?.map((card) => (
                                <article
                                    key={card.key}
                                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <p className="text-sm font-medium text-slate-500">{card.title}</p>
                                    <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                                        {formatNumber(card.value)}
                                    </p>
                                    <p className="mt-2 text-sm text-slate-500">{card.description}</p>
                                </article>
                            ))}
                        </section>

                        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
                                            Theo dõi nhanh
                                        </p>
                                        <h2 className="mt-2 text-2xl font-bold text-slate-900">Bác sĩ nổi bật gần đây</h2>
                                    </div>
                                    <Link
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                                        to="/admin/doctors"
                                    >
                                        Quản lý bác sĩ
                                        <ArrowRightOutlined />
                                    </Link>
                                </div>

                                <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-100">
                                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                                        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                                            <tr>
                                                <th className="px-5 py-3">Bác sĩ</th>
                                                <th className="px-5 py-3">Chuyên khoa</th>
                                                <th className="px-5 py-3">Lượt đặt</th>
                                                <th className="px-5 py-3">Đánh giá</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {dashboard?.recentDoctors?.map((doctor) => (
                                                <tr key={doctor.id}>
                                                    <td className="px-5 py-4">
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
                                                    <td className="px-5 py-4 text-slate-600">{doctor.specialtyName}</td>
                                                    <td className="px-5 py-4 font-semibold text-cyan-700">
                                                        {formatNumber(doctor.bookedCount)}
                                                    </td>
                                                    <td className="px-5 py-4 text-slate-600">⭐ {doctor.rating}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </article>

                            <div className="space-y-6">
                                <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
                                        Tóm tắt vận hành
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm text-slate-500">Giá khám tham khảo trung bình</p>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                {formatNumber(dashboard?.highlights?.averageFee || 0)} đ
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm text-slate-500">Bác sĩ nổi bật</p>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                {formatNumber(dashboard?.highlights?.featuredDoctors || 0)}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-sm text-slate-500">Hồ sơ cần bật hiển thị lại</p>
                                            <p className="mt-2 text-2xl font-bold text-slate-900">
                                                {formatNumber(dashboard?.highlights?.pendingDoctorProfiles || 0)}
                                            </p>
                                        </div>
                                    </div>
                                </article>

                                <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
                                                Nhóm chuyên khoa
                                            </p>
                                            <h2 className="mt-2 text-xl font-bold text-slate-900">Chuyên khoa có nhiều bác sĩ</h2>
                                        </div>
                                        <Link className="text-sm font-medium text-cyan-700 hover:text-cyan-800" to="/admin/specialties">
                                            Xem tất cả
                                        </Link>
                                    </div>

                                    <div className="mt-5 space-y-3">
                                        {dashboard?.highlights?.topSpecialties?.map((specialty) => (
                                            <div
                                                key={specialty.id}
                                                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                                            >
                                                <p className="font-medium text-slate-800">{specialty.name}</p>
                                                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-cyan-700 shadow-sm">
                                                    {specialty.doctorCount} bác sĩ
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            </div>
                        </section>
                    </div>
                )}
            </AdminLayout>
        </>
    );
};

export default AdminDashboardPage;

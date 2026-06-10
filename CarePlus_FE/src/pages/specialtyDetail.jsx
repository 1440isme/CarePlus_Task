import { LoadingOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "../components/public/PublicLayout";
import { DoctorCard, SectionTitle } from "../components/public/CatalogCards";
import { getSpecialtyDetail } from "../util/api";

const SpecialtyDetailPage = () => {
    const { slugOrId } = useParams();
    const [loading, setLoading] = useState(true);
    const [specialty, setSpecialty] = useState(null);

    useEffect(() => {
        let active = true;

        getSpecialtyDetail(slugOrId)
            .then((res) => {
                if (active && res.data?.success) {
                    setSpecialty(res.data.item);
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

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500">
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
                    <LoadingOutlined className="text-lg text-[#0092b8]" />
                    <span className="text-sm font-medium">Đang tải chi tiết chuyên khoa...</span>
                </div>
            </div>
        );
    }

    if (!specialty) {
        return (
            <PublicLayout clinicInfo={{ phone: "1900 1234", email: "lienhe@careplus.vn", address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh", workingHours: [] }} compact>
                <div className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-slate-950">Không tìm thấy chuyên khoa</h1>
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
                    <Link to="/specialties" className="hover:text-[#0092b8]">Chuyên khoa</Link>
                    <span className="mx-2">/</span>
                    <span>{specialty.name}</span>
                </div>

                <div className="mt-8 rounded-[30px] border border-slate-100 bg-white p-8 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${specialty.color || "from-sky-50 to-cyan-50"} text-2xl`}>
                        <span>{specialty.icon}</span>
                    </div>
                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-950">{specialty.name}</h1>
                    <p className="mt-4 max-w-3xl text-[16px] leading-8 text-slate-600">{specialty.description}</p>
                </div>

                <section className="mt-12">
                    <SectionTitle
                        title={`Bác sĩ thuộc chuyên khoa ${specialty.name}`}
                        description="Danh sách bác sĩ đang khám và tư vấn trong chuyên khoa này."
                    />
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {specialty.doctors.map((item) => (
                            <DoctorCard key={item.id} item={item} />
                        ))}
                    </div>
                </section>
            </section>
        </PublicLayout>
    );
};

export default SpecialtyDetailPage;

import { useEffect, useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import PublicLayout from "../components/public/PublicLayout";
import { SectionTitle, SpecialtyCard } from "../components/public/CatalogCards";
import { getSpecialties } from "../util/api";

const SpecialtiesPage = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("popular");

    useEffect(() => {
        let active = true;

        getSpecialties({ search, sort })
            .then((res) => {
                if (active && res.data?.success) {
                    setItems(res.data.items || []);
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
    }, [search, sort]);

    return (
        <PublicLayout clinicInfo={{ phone: "1900 1234", email: "lienhe@careplus.vn", address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh", workingHours: [] }} compact>
            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Danh sách chuyên khoa"
                    description="Tìm kiếm và khám phá các chuyên khoa phù hợp với nhu cầu khám chữa bệnh của bạn."
                />

                <div className="mt-8 grid gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)] lg:grid-cols-[1fr_220px]">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                        <SearchOutlined className="text-slate-400" />
                        <input
                            value={search}
                            onChange={(event) => {
                                setLoading(true);
                                setSearch(event.target.value);
                            }}
                            placeholder="Tìm theo tên chuyên khoa hoặc mô tả"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <select
                        value={sort}
                        onChange={(event) => {
                            setLoading(true);
                            setSort(event.target.value);
                        }}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none"
                    >
                        <option value="popular">Phổ biến nhất</option>
                        <option value="name_asc">Tên A-Z</option>
                    </select>
                </div>

                {loading ? (
                    <div className="mt-10 flex items-center justify-center gap-3 text-slate-500">
                        <LoadingOutlined className="text-lg text-[#0092b8]" />
                        <span>Đang tải chuyên khoa...</span>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {items.map((item) => (
                            <SpecialtyCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
};

export default SpecialtiesPage;

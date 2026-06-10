import { useEffect, useMemo, useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import PublicLayout from "../components/public/PublicLayout";
import { DoctorCard, SectionTitle } from "../components/public/CatalogCards";
import { getDoctors, getSpecialties } from "../util/api";

const DoctorsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [specialties, setSpecialties] = useState([]);
    const [items, setItems] = useState([]);

    const filters = useMemo(() => ({
        search: searchParams.get("search") || "",
        specialty: searchParams.get("specialty") || "",
        gender: searchParams.get("gender") || "",
        minFee: searchParams.get("minFee") || "",
        maxFee: searchParams.get("maxFee") || "",
        sort: searchParams.get("sort") || "booked_desc",
        availableOnly: searchParams.get("availableOnly") || "false",
        minExperience: searchParams.get("minExperience") || "",
    }), [searchParams]);

    useEffect(() => {
        getSpecialties({ sort: "popular" }).then((res) => {
            if (res.data?.success) {
                setSpecialties(res.data.items || []);
            }
        });
    }, []);

    useEffect(() => {
        let active = true;

        const query = Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value !== "" && value !== null)
        );

        getDoctors(query)
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
    }, [filters]);

    const updateFilter = (key, value) => {
        setLoading(true);
        const next = new URLSearchParams(searchParams);
        if (!value || value === "false") {
            next.delete(key);
        } else {
            next.set(key, value);
        }
        setSearchParams(next);
    };

    return (
        <PublicLayout clinicInfo={{ phone: "1900 1234", email: "lienhe@careplus.vn", address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh", workingHours: [] }} compact>
            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Danh sách bác sĩ"
                    description="Tìm kiếm và lọc bác sĩ theo chuyên khoa, mức giá, giới tính và mức độ còn slot trống."
                />

                <div className="mt-8 grid gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)] md:grid-cols-2 xl:grid-cols-4">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                        <SearchOutlined className="text-slate-400" />
                        <input
                            value={filters.search}
                            onChange={(event) => updateFilter("search", event.target.value)}
                            placeholder="Tên bác sĩ hoặc chuyên khoa"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                    </label>

                    <select
                        value={filters.specialty}
                        onChange={(event) => updateFilter("specialty", event.target.value)}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                    >
                        <option value="">Tất cả chuyên khoa</option>
                        {specialties.map((item) => (
                            <option key={item.id} value={item.slug}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.gender}
                        onChange={(event) => updateFilter("gender", event.target.value)}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                    >
                        <option value="">Tất cả giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                    </select>

                    <select
                        value={filters.sort}
                        onChange={(event) => updateFilter("sort", event.target.value)}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                    >
                        <option value="booked_desc">Đặt lịch nhiều nhất</option>
                        <option value="fee_asc">Giá tăng dần</option>
                        <option value="fee_desc">Giá giảm dần</option>
                        <option value="rating_desc">Đánh giá cao nhất</option>
                    </select>

                    <input
                        type="number"
                        min="0"
                        value={filters.minFee}
                        onChange={(event) => updateFilter("minFee", event.target.value)}
                        placeholder="Giá từ"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                    />

                    <input
                        type="number"
                        min="0"
                        value={filters.maxFee}
                        onChange={(event) => updateFilter("maxFee", event.target.value)}
                        placeholder="Giá đến"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                    />

                    <input
                        type="number"
                        min="0"
                        value={filters.minExperience}
                        onChange={(event) => updateFilter("minExperience", event.target.value)}
                        placeholder="Kinh nghiệm từ (năm)"
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                    />

                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                        <input
                            type="checkbox"
                            checked={filters.availableOnly === "true"}
                            onChange={(event) => updateFilter("availableOnly", event.target.checked ? "true" : "false")}
                            className="h-4 w-4 rounded border-slate-300 accent-[#0092b8]"
                        />
                        Chỉ hiện bác sĩ còn slot hôm nay
                    </label>
                </div>

                {loading ? (
                    <div className="mt-10 flex items-center justify-center gap-3 text-slate-500">
                        <LoadingOutlined className="text-lg text-[#0092b8]" />
                        <span>Đang tải danh sách bác sĩ...</span>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item) => (
                            <DoctorCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
};

export default DoctorsPage;

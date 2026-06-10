import { useEffect, useState } from "react";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import PublicLayout from "../components/public/PublicLayout";
import { ArticleCard, SectionTitle } from "../components/public/CatalogCards";
import { getArticles } from "../util/api";

const ArticlesPage = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        let active = true;

        getArticles({ search, category, sort: "latest" })
            .then((res) => {
                if (active && res.data?.success) {
                    setItems(res.data.items || []);
                    setCategories(res.data.categories || []);
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
    }, [search, category]);

    return (
        <PublicLayout clinicInfo={{ phone: "1900 1234", email: "lienhe@careplus.vn", address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh", workingHours: [] }} compact>
            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Danh sách bài viết / cẩm nang"
                    description="Tìm kiếm các bài viết mới nhất về sức khỏe, dinh dưỡng và kiến thức phòng bệnh."
                />

                <div className="mt-8 grid gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.04)] lg:grid-cols-[1fr_240px]">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                        <SearchOutlined className="text-slate-400" />
                        <input
                            value={search}
                            onChange={(event) => {
                                setLoading(true);
                                setSearch(event.target.value);
                            }}
                            placeholder="Tìm tiêu đề hoặc chủ đề bài viết"
                            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                    </label>

                    <select
                        value={category}
                        onChange={(event) => {
                            setLoading(true);
                            setCategory(event.target.value);
                        }}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
                    >
                        <option value="">Tất cả chủ đề</option>
                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="mt-10 flex items-center justify-center gap-3 text-slate-500">
                        <LoadingOutlined className="text-lg text-[#0092b8]" />
                        <span>Đang tải bài viết...</span>
                    </div>
                ) : (
                    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {items.map((item) => (
                            <ArticleCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </section>
        </PublicLayout>
    );
};

export default ArticlesPage;

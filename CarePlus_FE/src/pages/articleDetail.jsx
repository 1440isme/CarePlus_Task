import { LoadingOutlined, ReadOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "../components/public/PublicLayout";
import { getArticleDetail } from "../util/api";

const ArticleDetailPage = () => {
    const { slugOrId } = useParams();
    const [loading, setLoading] = useState(true);
    const [article, setArticle] = useState(null);

    useEffect(() => {
        let active = true;

        getArticleDetail(slugOrId)
            .then((res) => {
                if (active && res.data?.success) {
                    setArticle(res.data.item);
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
                    <span className="text-sm font-medium">Đang tải chi tiết bài viết...</span>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <PublicLayout clinicInfo={{ phone: "1900 1234", email: "lienhe@careplus.vn", address: "123 Nguyễn Thị Minh Khai, Phường 6, Quận 3, TP. Hồ Chí Minh", workingHours: [] }} compact>
                <div className="mx-auto max-w-[1200px] px-4 py-20 text-center sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-slate-950">Không tìm thấy bài viết</h1>
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
                    <Link to="/articles" className="hover:text-[#0092b8]">Cẩm nang</Link>
                    <span className="mx-2">/</span>
                    <span>{article.title}</span>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
                    <article className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0092b8]">
                                <ReadOutlined />
                                Cẩm nang sức khỏe
                            </span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {article.category}
                            </span>
                        </div>
                        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-950">{article.title}</h1>
                        <p className="mt-3 text-sm text-slate-500">{article.publishedAt}</p>
                        <img src={article.image} alt={article.title} className="mt-8 h-[340px] w-full rounded-[24px] object-cover" />

                        <div className="mt-8 space-y-6 text-[16px] leading-8 text-slate-600">
                            <p className="text-xl font-semibold text-slate-900">{article.summary}</p>
                            {article.content.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </article>

                    <aside className="h-fit rounded-[30px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                        <h2 className="text-2xl font-bold text-slate-950">Bài viết liên quan</h2>
                        <div className="mt-6 space-y-4">
                            {article.relatedArticles.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/articles/${item.slug}`}
                                    className="flex gap-4 rounded-2xl border border-slate-100 p-3 transition hover:border-sky-100 hover:bg-sky-50/40"
                                >
                                    <img src={item.image} alt={item.title} className="h-20 w-24 rounded-xl object-cover" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0092b8]">{item.category}</p>
                                        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-950">{item.title}</h3>
                                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <span>{item.publishedAt}</span>
                                            <RightOutlined className="text-[10px]" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>
        </PublicLayout>
    );
};

export default ArticleDetailPage;

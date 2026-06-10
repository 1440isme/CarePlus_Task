import { useEffect, useState } from "react";
import { CalendarOutlined, CheckCircleFilled, LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../components/public/PublicLayout";
import { ArticleCard, DoctorCard, QuickFeatureCard, SectionTitle, SpecialtyCard } from "../components/public/CatalogCards";
import { getPublicHomeData } from "../util/api";

const HomePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        let active = true;

        getPublicHomeData()
            .then((res) => {
                if (active && res.data?.success) {
                    setHomeData(res.data.data);
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
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-500">
                <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-sm">
                    <LoadingOutlined className="text-lg text-[#0092b8]" />
                    <span className="text-sm font-medium">Đang tải trang chủ CarePlus...</span>
                </div>
            </div>
        );
    }

    const clinicInfo = homeData?.clinicInfo;
    const stats = homeData?.stats || {};

    return (
        <PublicLayout clinicInfo={clinicInfo}>
            <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#057ca4_0%,_#0092b8_45%,_#11b8b0_100%)] text-white">
                <div className="absolute left-10 top-[75%] hidden h-44 w-44 rounded-full bg-white/12 blur-[1px] lg:block" />
                <div className="absolute right-24 top-10 hidden h-56 w-56 rounded-full bg-white/10 blur-[1px] lg:block" />
                <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-14 sm:px-6 lg:px-8 lg:pb-0">
                    <div className="grid gap-14 lg:grid-cols-[1.02fr_0.98fr]">
                        <div className="pb-14 lg:pb-20 lg:pt-8">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/12 px-4 py-2 text-sm font-medium text-white shadow-sm backdrop-blur">
                                <CheckCircleFilled className="text-yellow-300" />
                                <span>Được tin tưởng bởi hàng nghìn bệnh nhân</span>
                            </div>
                            <h1 className="mt-8 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[58px] lg:leading-[1.12]">
                                Đặt lịch khám tại CarePlus
                                <span className="text-[#ffd34d]"> nhanh chóng, đúng bác sĩ, </span>
                                đúng giờ
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                                Tìm bác sĩ, chuyên khoa và đặt lịch khám chỉ trong vài bước. Không cần xếp hàng chờ đợi, mọi thông tin đều rõ ràng và dễ theo dõi.
                            </p>

                            <div className="mt-8 flex overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(2,37,53,0.25)]">
                                <div className="flex flex-1 items-center gap-3 px-4 py-4">
                                    <SearchOutlined className="text-slate-400" />
                                    <input
                                        value={keyword}
                                        onChange={(event) => setKeyword(event.target.value)}
                                        placeholder="Tìm kiếm bác sĩ hoặc chuyên khoa"
                                        className="w-full bg-transparent text-[15px] text-slate-900 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/doctors?search=${encodeURIComponent(keyword)}`)}
                                    className="bg-[#ff9f1c] px-6 text-sm font-semibold text-white transition hover:bg-[#ff8c00]"
                                >
                                    Tìm kiếm
                                </button>
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/doctors"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff9f1c] px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#ff8c00]"
                                >
                                    <CalendarOutlined />
                                    <span>Đặt lịch khám</span>
                                </Link>
                                <Link
                                    to="/specialties"
                                    className="inline-flex items-center justify-center rounded-2xl bg-white/18 px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/24"
                                >
                                    Xem chuyên khoa
                                </Link>
                            </div>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="mt-10 rounded-[34px] border border-white/18 bg-white/10 p-8 backdrop-blur">
                                <div className="rounded-[30px] bg-white p-6 text-slate-700 shadow-[0_24px_60px_rgba(2,37,53,0.18)]">
                                    <p className="text-sm font-semibold text-[#0092b8]">Hỗ trợ đặt lịch thông minh</p>
                                    <h2 className="mt-2 text-[38px] font-bold leading-tight text-slate-950">Chủ động quản lý lịch khám</h2>
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        {[
                                            "Chọn chuyên khoa phù hợp",
                                            "Xem khung giờ còn trống",
                                            "Nhận email xác nhận",
                                            "Quản lý lịch hẹn mọi lúc",
                                        ].map((item) => (
                                            <div key={item} className="rounded-3xl bg-slate-50 px-4 py-5 text-sm text-slate-600">
                                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0092b8] shadow-sm">
                                                    <CheckCircleFilled />
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 bg-white/6">
                    <div className="mx-auto grid max-w-[1200px] gap-6 px-4 py-9 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                        <div>
                            <div className="text-4xl font-bold text-[#ffd34d]">{stats.specialties || 0}+</div>
                            <div className="mt-1 text-sm text-white/75">Chuyên khoa</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-[#ffd34d]">{stats.doctors || 0}+</div>
                            <div className="mt-1 text-sm text-white/75">Bác sĩ chuyên khoa</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-[#ffd34d]">{stats.trustedPatients || 0}+</div>
                            <div className="mt-1 text-sm text-white/75">Bệnh nhân tin tưởng</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-[#ffd34d]">{stats.averageRating || 0}★</div>
                            <div className="mt-1 text-sm text-white/75">Đánh giá trung bình</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <QuickFeatureCard icon="specialty" title="Khám chuyên khoa" description="8 chuyên khoa đa dạng" />
                    <QuickFeatureCard icon="doctor" title="Bác sĩ nổi bật" description="Đội ngũ giàu kinh nghiệm" />
                    <QuickFeatureCard icon="booking" title="Đặt lịch trong ngày" description="Slot còn trống ngay hôm nay" />
                    <QuickFeatureCard icon="handbook" title="Hỏi đáp & Hướng dẫn" description="Giải đáp thắc mắc nhanh" />
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Chuyên khoa phổ biến"
                    description="Đội ngũ chuyên gia giàu kinh nghiệm trong nhiều lĩnh vực y tế."
                    actionLabel="Xem tất cả"
                    actionTo="/specialties"
                />
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {(homeData?.featuredSpecialties || []).map((item) => (
                        <SpecialtyCard key={item.id} item={item} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Bác sĩ nổi bật"
                    description="Các bác sĩ được bệnh nhân lựa chọn nhiều và có lịch khám rõ ràng."
                    actionLabel="Xem tất cả"
                    actionTo="/doctors"
                />
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {(homeData?.featuredDoctors || []).map((item) => (
                        <DoctorCard key={item.id} item={item} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Bác sĩ được đặt lịch nhiều"
                    description="Gợi ý nhanh các bác sĩ có lượt đặt lịch cao và được tin tưởng trong thời gian gần đây."
                    actionLabel="Tìm bác sĩ"
                    actionTo="/doctors?sort=booked_desc"
                />
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {(homeData?.topBookedDoctors || []).map((item) => (
                        <DoctorCard key={item.id} item={item} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
                <SectionTitle
                    title="Cẩm nang sức khỏe"
                    description="Kiến thức y tế hữu ích từ đội ngũ CarePlus để bạn chăm sóc sức khỏe chủ động hơn mỗi ngày."
                    actionLabel="Xem tất cả"
                    actionTo="/articles"
                />
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {(homeData?.latestArticles || []).map((item) => (
                        <ArticleCard key={item.id} item={item} />
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
};

export default HomePage;

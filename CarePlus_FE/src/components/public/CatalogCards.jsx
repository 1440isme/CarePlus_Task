import { ArrowRightOutlined, CalendarOutlined, HeartFilled, TeamOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const SectionTitle = ({ title, description, actionLabel, actionTo }) => (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">{title}</h2>
            {description ? <p className="mt-2 max-w-2xl text-[15px] leading-7 text-slate-500">{description}</p> : null}
        </div>
        {actionLabel && actionTo ? (
            <Link to={actionTo} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0092b8] transition hover:text-[#007da0]">
                <span>{actionLabel}</span>
                <ArrowRightOutlined />
            </Link>
        ) : null}
    </div>
);

export const SpecialtyCard = ({ item }) => (
    <Link
        to={`/specialties/${item.slug}`}
        className="block rounded-[26px] border border-slate-100 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-sky-100 hover:shadow-[0_24px_50px_rgba(0,146,184,0.08)]"
    >
        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color || "from-sky-50 to-cyan-50"} text-xl`}>
            <span>{item.icon}</span>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.name}</h3>
        <p className="mt-3 min-h-[72px] text-[15px] leading-7 text-slate-500">{item.summary}</p>
        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
            <span>{item.doctors || item.doctorCount} bác sĩ</span>
            <ArrowRightOutlined className="text-[#0092b8]" />
        </div>
    </Link>
);

export const DoctorCard = ({ item }) => (
    <Link
        to={`/doctors/${item.slug}`}
        className="block overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.08)]"
    >
        <img src={item.image} alt={item.fullName} className="h-56 w-full object-cover" />
        <div className="p-5">
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#0092b8]">
                {item.specialty?.name}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.fullName}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.title}</p>
            <p className="mt-4 line-clamp-2 text-[15px] leading-7 text-slate-500">{item.bio}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-500">
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <p className="font-semibold text-slate-900">{item.availableSlotsToday}</p>
                    <p>Slot trống hôm nay</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <p className="font-semibold text-slate-900">{item.bookedCount}</p>
                    <p>Lượt đặt lịch</p>
                </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold text-[#0092b8]">{item.consultationFee.toLocaleString("vi-VN")}đ</span>
                <span className="text-sm font-medium text-slate-500">Xem chi tiết</span>
            </div>
        </div>
    </Link>
);

export const ArticleCard = ({ item }) => (
    <Link
        to={`/articles/${item.slug}`}
        className="block overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.08)]"
    >
        <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
        <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0092b8]">{item.category}</p>
            <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-7 text-slate-950">{item.title}</h3>
            <p className="mt-3 line-clamp-2 text-[15px] leading-7 text-slate-500">{item.summary}</p>
            <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>{item.publishedAt}</span>
                <ArrowRightOutlined className="text-[#0092b8]" />
            </div>
        </div>
    </Link>
);

export const QuickFeatureCard = ({ icon, title, description }) => {
    const iconNode = {
        specialty: <HeartFilled />,
        doctor: <TeamOutlined />,
        booking: <CalendarOutlined />,
        handbook: <ArrowRightOutlined />,
    }[icon] || <HeartFilled />;

    return (
        <article className="rounded-[24px] border border-slate-100 bg-white p-6 text-center shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl text-[#0092b8]">
                {iconNode}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </article>
    );
};

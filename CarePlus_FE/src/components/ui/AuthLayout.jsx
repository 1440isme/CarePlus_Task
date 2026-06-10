import { HeartFilled } from "@ant-design/icons";

const AuthLayout = ({
    title,
    description,
    children,
}) => {
    return (
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[linear-gradient(150deg,#ecfeff_0%,#f0fdfa_100%)] px-4 py-10 sm:px-6">
            <div className="absolute left-[-4rem] top-20 h-48 w-48 rounded-full bg-sky-200/20 blur-3xl" />
            <div className="absolute right-[-4rem] top-12 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />
            <div className="relative flex w-full max-w-[420px] flex-col items-center">
                <div className="mb-6 flex items-center gap-2.5">
                    <span className="flex h-[33px] w-[33px] items-center justify-center rounded-[13px] bg-[#0092b8] text-sm text-white">
                        <HeartFilled />
                    </span>
                    <span className="text-[18px] font-bold tracking-tight text-slate-950">
                        Care<span className="text-[#0092b8]">Plus</span>
                    </span>
                </div>
                <div className="mb-7 space-y-2 text-center">
                    <h1 className="text-[22px] font-bold tracking-tight text-slate-950">{title}</h1>
                    <p className="text-[13px] leading-[19px] text-slate-500">{description}</p>
                </div>
                <div className="w-full">{children}</div>
            </div>
        </section>
    );
};

export default AuthLayout;

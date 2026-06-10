const ProfileSection = ({ title, description, action, children }) => {
    return (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                    <h2 className="font-serif text-2xl tracking-tight text-slate-950">{title}</h2>
                    {description ? <p className="text-sm leading-6 text-slate-500">{description}</p> : null}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
};

export default ProfileSection;

const AuthCard = ({ footer, children }) => {
    return (
        <div className="rounded-[15px] border border-[#f3f4f6] bg-white p-[31px] shadow-[0px_1px_1.5px_rgba(0,0,0,0.10),0px_1px_1px_rgba(0,0,0,0.10)]">
            {children}
            {footer ? (
                <div className="pt-[15px] text-center text-[13px] leading-[19px] text-slate-500">
                    {footer}
                </div>
            ) : null}
        </div>
    );
};

export default AuthCard;

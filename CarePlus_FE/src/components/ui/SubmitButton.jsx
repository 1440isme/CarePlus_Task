const SubmitButton = ({ children, loading = false, icon = null, disabled = false }) => {
    return (
        <button
            type="submit"
            disabled={disabled || loading}
            className="inline-flex h-[45px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#0092b8] px-5 py-3 text-[15px] font-medium text-white transition hover:bg-[#007fa0] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
            {icon}
            <span>{children}</span>
        </button>
    );
};

export default SubmitButton;

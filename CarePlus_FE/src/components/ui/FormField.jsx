const containerClassName = ({ disabled, error }) => [
    "flex min-h-13 items-center gap-3 rounded-2xl border bg-white px-4 transition",
    disabled ? "border-slate-200 bg-slate-100 text-slate-400" : "border-slate-200 focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/8",
    error ? "border-rose-400 ring-4 ring-rose-500/10" : "",
].join(" ");

const FormField = ({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    autoComplete,
    error,
    hint,
    icon,
    inputMode,
    maxLength,
    readOnly = false,
    disabled = false,
    action = null,
    labelAction = null,
    children = null,
}) => {
    return (
        <label htmlFor={id} className="block space-y-[5px]">
            <span className="flex items-center justify-between gap-3 text-[13px] font-medium text-[#4a5565]">
                <span>{label}</span>
                {labelAction}
            </span>
            <div className={containerClassName({ disabled: disabled || readOnly, error })}>
                {icon ? <span className="text-base text-slate-400">{icon}</span> : null}
                {children || (
                    <input
                        id={id}
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        inputMode={inputMode}
                        maxLength={maxLength}
                        autoCapitalize="none"
                        readOnly={readOnly}
                        disabled={disabled}
                        className="w-full bg-transparent py-[12px] text-[13px] text-slate-900 outline-none placeholder:text-[rgba(15,23,42,0.5)]"
                    />
                )}
                {action}
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            {!error && hint ? <p className="text-sm text-slate-500">{hint}</p> : null}
        </label>
    );
};

export default FormField;

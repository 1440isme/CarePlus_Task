import { useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import FormField from "./FormField";

const PasswordField = (props) => {
    const [visible, setVisible] = useState(false);

    return (
        <FormField
            {...props}
            type={visible ? "text" : "password"}
            action={(
                <button
                    type="button"
                    onClick={() => setVisible((prev) => !prev)}
                    className="text-slate-400 transition hover:text-slate-700"
                    aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                    {visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
            )}
        />
    );
};

export default PasswordField;

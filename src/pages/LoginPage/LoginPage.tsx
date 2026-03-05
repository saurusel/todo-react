import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TODOS_ROUTE } from "../../shared/constants/routes";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "../../store/authSlice";
import { login as loginApi } from "../../api/auth";
import { InlineSvg } from "../../components/InlineSvg";
import { ICON_EYE, ICON_EYE_OFF } from "../../shared/assets/icons";

function generatePassword() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";

    let out = "";
    out += letters[Math.floor(Math.random() * letters.length)];
    out += digits[Math.floor(Math.random() * digits.length)];

    const all = letters + letters.toUpperCase() + digits;
    while (out.length < 10) out += all[Math.floor(Math.random() * all.length)];
    return out;
}

function isValidPassword(p: string) {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(p);
}

function isValidEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const passOk = useMemo(() => isValidPassword(password), [password]);
    const loginOk = useMemo(() => isValidEmail(login), [login]);
    const canSubmit = agreed && loginOk && passOk && !isSubmitting;

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;
        if (!agreed || !loginOk || !passOk) return;

        setIsSubmitting(true);

        try {
            await loginApi(login.trim(), password);
            dispatch(loginSuccess());
            navigate(TODOS_ROUTE, { replace: true });
        } catch (err) {
            if (process.env.APP_LOGS === "1") console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <main className="app">
                    <form className="login-form" onSubmit={onSubmit}>
                        <div className="login-field">
                            <div className="login-label">Login</div>
                            <div className="input-wrap">
                                <input
                                    className="input"
                                    type="text"
                                    name="login"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    placeholder="Enter login"
                                    autoComplete="off"
                                />
                            </div>

                            {!loginOk && login.trim().length > 0 && (
                                <div className="login-hint login-hint--error">
                                    Enter valid email
                                </div>
                            )}
                        </div>

                        <div className="login-field">
                            <div className="login-label">Password</div>

                            <div className="login-pass-row">
                                <div className="input-wrap login-pass-input">
                                    <input
                                        className="input"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter password"
                                        autoComplete="off"
                                    />

                                    <button
                                        className="input-icon-btn"
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                    >
                                        <InlineSvg
                                            className="icon-img"
                                            svg={
                                                showPassword
                                                    ? ICON_EYE_OFF
                                                    : ICON_EYE
                                            }
                                        />
                                    </button>
                                </div>

                                <button
                                    className="login-btn"
                                    type="button"
                                    onClick={() =>
                                        setPassword(generatePassword())
                                    }
                                >
                                    generate
                                </button>
                            </div>
                            <div
                                className={`login-hint${
                                    passOk || password.length === 0
                                        ? ""
                                        : " login-hint--error"
                                }`}
                            >
                                Min 8 chars, letters + digits
                            </div>
                        </div>

                        <label className="login-checkbox">
                            <input
                                className="checkbox-input"
                                type="checkbox"
                                name="agreed"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                            />
                            <span className="checkbox-box">
                                <img src="/icons/check-mark.svg" alt="" />
                            </span>
                            <span className="login-checkbox-text">
                                я согласен, что я нахожусь на скоростной полосе
                                Frontend, но чтобы вкатиться — я должен
                                работать.
                            </span>
                        </label>

                        <button
                            className="login-submit"
                            type="submit"
                            disabled={!canSubmit}
                        >
                            {isSubmitting ? "loading..." : "login"}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}

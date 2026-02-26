import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TODOS_ROUTE } from "../../shared/constants/routes";

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

export function LoginPage() {
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const passOk = useMemo(() => isValidPassword(password), [password]);
    const canSubmit = agreed && login.trim().length > 0 && passOk;

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        // пока без Redux
        navigate(TODOS_ROUTE, { replace: true });
    };

    return (
        <div className="page page--auth">
            <div className="container">
                <main className="app">
                    <section className="login-surface">
                        <form className="login-form" onSubmit={onSubmit}>
                            <div className="login-field">
                                <div className="login-label">Login</div>
                                <div className="input-wrap">
                                    <input
                                        className="input"
                                        type="text"
                                        value={login}
                                        onChange={(e) =>
                                            setLogin(e.target.value)
                                        }
                                        placeholder="Enter login"
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="login-field">
                                <div className="login-label">Password</div>

                                <div className="login-pass-row">
                                    <div className="input-wrap login-pass-input">
                                        <input
                                            className="input"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
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
                                            <img
                                                className="icon-img"
                                                src={
                                                    showPassword
                                                        ? "/icons/eye-off.svg"
                                                        : "/icons/eye.svg"
                                                }
                                                alt=""
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
                                    className={`login-hint${passOk || password.length === 0 ? "" : " login-hint--error"}`}
                                >
                                    Min 8 chars, letters + digits
                                </div>
                            </div>

                            <label className="login-checkbox">
                                <input
                                    className="checkbox-input"
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) =>
                                        setAgreed(e.target.checked)
                                    }
                                />
                                <span className="checkbox-box">
                                    <img src="/icons/check-mark.svg" alt="" />
                                </span>
                                <span className="login-checkbox-text">
                                    I agree that ...
                                </span>
                            </label>

                            <button
                                className="login-submit"
                                type="submit"
                                disabled={!canSubmit}
                            >
                                login
                            </button>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
}

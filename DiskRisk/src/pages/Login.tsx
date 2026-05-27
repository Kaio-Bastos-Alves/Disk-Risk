import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginResponse = {
    token?: string;
    error?: string;
};

export default function Login(): React.JSX.Element {
    const navigate = useNavigate();
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const validate = () => {
        if (!email.trim()) return "Email is required";
        // simple RFC-5322-ish email check
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) return "Please enter a valid email";
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        const validationError = validate();
        if (validationError) {
            setFormError(validationError);
            return;
        }

        setLoading(true);
        try {
            // Replace URL with your auth endpoint. This example expects { token } on success.
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, remember }),
            });

            const data = (await res.json()) as LoginResponse;
            if (!res.ok) {
                throw new Error(data.error ?? "Login failed");
            }

            // Example: store token (adjust to your auth strategy)
            if (data.token) {
                if (remember) localStorage.setItem("authToken", data.token);
                else sessionStorage.setItem("authToken", data.token);
            }

            // navigate to protected area
            navigate("/dashboard");
        } catch (err: any) {
            setFormError(err?.message ?? "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <form onSubmit={handleSubmit} style={formStyle} aria-describedby="form-error">
                <h2 style={{ margin: "0 0 16px 0" }}>Sign in</h2>

                <label style={labelStyle}>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        placeholder="you@example.com"
                        aria-invalid={!!formError && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
                        required
                    />
                </label>

                <label style={labelStyle}>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="••••••••"
                        aria-invalid={!!formError && password.length < 6}
                        required
                    />
                </label>

                <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        style={{ marginRight: 8 }}
                    />
                    Remember me
                </label>

                {formError && (
                    <div id="form-error" role="alert" style={errorStyle}>
                        {formError}
                    </div>
                )}

                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}

/* Simple inline styles to keep the example self-contained */
const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f6f7fb",
    padding: 20,
};

const formStyle: React.CSSProperties = {
    width: 360,
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 10px 30px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
};

const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    marginBottom: 12,
    fontSize: 14,
    color: "#222",
};

const inputStyle: React.CSSProperties = {
    marginTop: 6,
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #ddd",
    outline: "none",
    boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
    marginTop: 8,
    padding: "10px 12px",
    fontSize: 15,
    borderRadius: 6,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 6,
    color: "#b91c1c",
    fontSize: 13,
};
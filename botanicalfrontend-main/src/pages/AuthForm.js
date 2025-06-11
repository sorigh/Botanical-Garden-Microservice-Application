import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import jwtDecode from "jwt-decode";

const API_BASE = "http://localhost:8082/user-service/auth";

function AuthForm() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(`Status ${res.status}: ${text}`);
      }

      if (isLogin) {
        const data = JSON.parse(text);
        localStorage.setItem("jwtToken", data.token);
        setMessage(t("login_success"));
        navigate("/dashboard");
      } else {
        setMessage(t("registration_success"));
      }
    } catch (err) {
      setMessage(t("error_prefix") + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>{isLogin ? t("login_title") : t("register_title")}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("username_label")}:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>{t("password_label")}:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>
        <button type="submit">
          {isLogin ? t("login_button") : t("register_button")}
        </button>
      </form>

      <p style={{ marginTop: 20 }}>
        {isLogin ? t("no_account") : t("have_account")}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
        >
          {isLogin ? t("register_link") : t("login_link")}
        </button>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AuthForm;

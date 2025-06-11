import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const API_BASE = "http://localhost:8085/user-service/auth";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { username, password }
            : { username, password, email, phoneNumber }
        ),
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(`Status ${res.status}: ${text}`);
      }

      if (isLogin) {
        const data = JSON.parse(text);
        localStorage.setItem("jwtToken", data.token);
        setMessage(t("login_successful"));
        navigate("/");
      } else {
        setMessage(t("registration_successful"));
        // Clear email and phone fields on successful registration
        setEmail("");
        setPhoneNumber("");
        setIsLogin(true);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>{isLogin ? t("login") : t("register")}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("username")}:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>{t("password")}:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label>{t("email")}:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label>{t("phone_number")}:</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                autoComplete="tel"
              />
            </div>
          </>
        )}

        <button type="submit">{t("submit")}</button>
      </form>

      <p style={{ marginTop: 20 }}>
        {isLogin ? t("dont_have_account") : t("already_have_account")}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
        >
          {isLogin ? t("register_here") : t("login_here")}
        </button>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}

export default AuthForm;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

export default function PersonalDataPage() {
  const { t } = useTranslation();
  const [username, setUsername] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login-page");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUsername(decoded.sub || t("unknown_user"));
    } catch (err) {
      localStorage.removeItem("jwtToken");
      navigate("/login-page");
    }
  }, [navigate, t]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login-page");
  };

  const handleChangePassword = async () => {
    setMessage(null);
    setLoading(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setMessage(t("not_authenticated"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8085/user-service/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (res.ok) {
        setMessage(t("password_changed"));
        setOldPassword("");
        setNewPassword("");
      } else {
        const text = await res.text();
        setMessage(t("error") + ": " + text);
      }
    } catch (e) {
      setMessage(t("network_error"));
    }
    setLoading(false);
  };

  if (!username) return <p>{t("loading")}</p>;

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>{t("personal_data")}</h2>
      <p>
        <strong>{t("username")}:</strong> {username}
      </p>

      <div style={{ marginTop: 20 }}>
        <h3>{t("change_password")}</h3>
        <input
          type="password"
          placeholder={t("old_password")}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <input
          type="password"
          placeholder={t("new_password")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, width: "100%" }}
        />
        <button onClick={handleChangePassword} disabled={loading}>
          {loading ? t("changing") : t("change_password")}
        </button>
        {message && <p style={{ marginTop: 10 }}>{message}</p>}
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: 30,
          backgroundColor: "#d9534f",
          color: "white",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: 4,
        }}
      >
        {t("log_out")}
      </button>
    </div>
  );
}
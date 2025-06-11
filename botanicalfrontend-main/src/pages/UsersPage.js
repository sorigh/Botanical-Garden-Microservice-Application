import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import { toCSV, toXML, toDOC } from "../utils/exportUtils"; // adjust the path as needed


const API_URL = "http://localhost:8085/user-service/users";

export default function UsersPage({ visitorMode = false }) {
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    roles: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken");

  const fetchUsers = React.useCallback(async () => {
    if (!token) {
      setError(t("error.noToken"));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`${t("error.httpStatus")}: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSelect = (user) => {
    setSelected(user);
    setForm({
      id: user.id ?? "",
      username: user.username ?? "",
      password: "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      roles: Array.isArray(user.roles)
        ? user.roles.map((r) => (typeof r === "string" ? r : r.role))
        : [],
    });
  };

  const onClear = () => {
    setSelected(null);
    setForm({
      id: "",
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      roles: [],
    });
  };

  const toggleRole = (role) => {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role)
        ? f.roles.filter((r) => r !== role)
        : [...f.roles, role],
    }));
  };

  const onAdd = async () => {
    setSaving(true);
    setError(null);
    try {
      const { id, ...rest } = form;
      if (!rest.password) {
        setError(t("error.passwordRequired"));
        setSaving(false);
        return;
      }

      const body = {
        ...rest,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(t("error.addFailed"));
      await fetchUsers();
      onClear();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onUpdate = async () => {
    if (!form.id) return alert(t("alert.selectUserToUpdate"));
    setSaving(true);
    setError(null);
    try {
      const body = {
        username: form.username,
        roles: form.roles,
        email: form.email,
        phoneNumber: form.phoneNumber,
      };

      if (form.password && form.password.trim() !== "") {
        body.password = form.password;
      }

      const res = await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(t("error.updateFailed"));
      await fetchUsers();
      onClear();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!form.id) return alert(t("alert.selectUserToDelete"));
    if (!window.confirm(t("alert.confirmDelete"))) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${form.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(t("error.deleteFailed"));
      await fetchUsers();
      onClear();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const allRoles = ["USER", "EMPLOYEE", "MANAGER", "ADMINISTRATOR"];

  const renderRolesWithHighlight = (userRoles) => {
    const rolesArray = (userRoles || []).map((r) =>
      typeof r === "string" ? r : r.role
    );
    return rolesArray.map((role, idx) => {
      const isSelectedUserHasRole = form.roles.includes(role);
      return (
        <span
          key={role}
          style={{
            backgroundColor: isSelectedUserHasRole ? "#b3d9ff" : "transparent",
            padding: "2px 6px",
            borderRadius: 4,
            marginRight: 4,
            fontWeight: isSelectedUserHasRole ? "600" : "normal",
          }}
        >
          {t(`roles.${role.toLowerCase()}`)}
          {idx < rolesArray.length - 1 ? ", " : ""}
        </span>
      );
    });
  };

  const handleExportCSV = () => {
    const csv = toCSV(users);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "users.csv");
  };

  const handleExportXML = () => {
    const xml = toXML(users);
    const blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
    saveAs(blob, "users.xml");
  };

  const handleExportDOC = () => {
    const blob = toDOC(users);
    saveAs(blob, "users.doc");
  };


  return (
    <div style={{ padding: 20, maxWidth: 1200, maxHeight: 500, margin: "auto" }}>
      <h2>{t("usersManagement.title")}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: 10 }}>
      <button onClick={handleExportCSV} disabled={!users.length}>
        {t("export.csv")}
      </button>{" "}
      <button onClick={handleExportXML} disabled={!users.length}>
        {t("export.xml")}
      </button>{" "}
      <button onClick={handleExportDOC} disabled={!users.length}>
        {t("export.doc")}
      </button>
    </div>

      <div style={{ display: "flex", gap: 20 }}>
        
        {/* Users table */}
        <div
          style={{
            flex: 1,
            maxHeight: 300,
            overflowY: "auto",
            border: "1px solid #ccc",
          }}
        >
          {loading ? (
            <p>{t("usersManagement.loadingUsers")}</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>{t("usersManagement.id")}</th>
                  <th>{t("usersManagement.username")}</th>
                  <th>{t("usersManagement.email")}</th>
                  <th>{t("usersManagement.phoneNumber")}</th>
                  <th>{t("usersManagement.roles")}</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      {t("usersManagement.noUsers")}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => onSelect(u)}
                      style={{
                        backgroundColor: selected?.id === u.id ? "#def" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.phoneNumber}</td>
                      <td>{renderRolesWithHighlight(u.roles)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Form */}
        <div style={{ minWidth: 300 }}>
          <div>
            <label>{t("form.id")}:</label>
            <input type="text" value={form.id ?? ""} readOnly style={{ width: "100%" }} />
          </div>
          <div>
            <label>{t("form.username")}:</label>
            <input
              type="text"
              value={form.username ?? ""}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={{ width: "100%" }}
              disabled={visitorMode}
            />
          </div>
          <div>
            <label>{t("form.password")}:</label>
            <input
              type="password"
              value={form.password ?? ""}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: "100%" }}
              placeholder={selected ? t("form.passwordPlaceholder") : undefined}
              disabled={visitorMode}
            />
          </div>
          <div>
            <label>{t("form.email")}:</label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: "100%" }}
              disabled={visitorMode}
            />
          </div>
          <div>
            <label>{t("form.phoneNumber")}:</label>
            <input
              type="text"
              value={form.phoneNumber ?? ""}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              style={{ width: "100%" }}
              disabled={visitorMode}
            />
          </div>
          <div>
            <label>{t("form.roles")}:</label>
            <div>
              {allRoles.map((role) => (
                <label key={role} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={form.roles.includes(role)}
                    onChange={() => toggleRole(role)}
                    disabled={visitorMode}
                  />
                  {t(`roles.${role.toLowerCase()}`)}
                </label>
              ))}
            </div>
          </div>

          {!visitorMode && (
            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button onClick={onAdd} disabled={saving}>{t("buttons.add")}</button>
              <button onClick={onUpdate} disabled={saving}>{t("buttons.update")}</button>
              <button onClick={onDelete} disabled={saving}>{t("buttons.delete")}</button>
              <button onClick={onClear} disabled={saving}>{t("buttons.clear")}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API_BASE = "http://localhost:8085/specimen-service/specimens";

export default function SpecimensPage({ visitorMode = false }) {
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Pentru formularul de creare/editare
  const [form, setForm] = useState({
    specimenId: null,
    location: "",
    imageUrl: "",
    plantId: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch toate specimenurile
  const fetchSpecimens = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch specimens");
      const data = await res.json();
      setSpecimens(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecimens();
  }, []);

  // Submit formular create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${API_BASE}/${form.specimenId}` : API_BASE;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: form.location,
          imageUrl: form.imageUrl,
          plantId: parseInt(form.plantId, 10),
        }),
      });

      if (!res.ok) throw new Error("Failed to save specimen");

      // Refetch lista specimenurilor
      await fetchSpecimens();

      // Reset formular
      setForm({ specimenId: null, location: "", imageUrl: "", plantId: "" });
      setIsEditing(false);
    } catch (e) {
      alert(e.message);
    }
  };

  // Șterge specimen
  const handleDelete = async (id) => {
    if (!window.confirm("Sigur vrei să ștergi specimenul?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete specimen");
      await fetchSpecimens();
    } catch (e) {
      alert(e.message);
    }
  };

  // Pregătește formularul pentru editare
  const startEdit = (specimen) => {
    setForm({
      specimenId: specimen.specimenId,
      location: specimen.location,
      imageUrl: specimen.imageUrl,
      plantId: specimen.plantId,
    });
    setIsEditing(true);
  };

  // Anulează editarea
  const cancelEdit = () => {
    setForm({ specimenId: null, location: "", imageUrl: "", plantId: "" });
    setIsEditing(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>{t("title.specimens")}</h1>

      {!visitorMode && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder={t("label.location")}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder={t("label.imageUrl")}
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder={t("label.plantId")}
            value={form.plantId}
            onChange={(e) => setForm({ ...form, plantId: e.target.value })}
            required
            min={1}
          />
          <button type="submit" style={{ marginLeft: 10 }}>
            {isEditing ? t("button.update") : t("button.add")}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{ marginLeft: 10 }}
            >
              {t("button.cancel")}
            </button>
          )}
        </form>
      )}

      {loading && <p>{t("loading.specimens")}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>{t("label.id")}</th>
            <th>{t("label.location")}</th>
            <th>{t("label.imageUrl")}</th>
            <th>{t("label.plantId")}</th>
            {!visitorMode && <th>{t("button.edit")}/{t("button.delete")}</th>}
          </tr>
        </thead>
        <tbody>
          {specimens.map((specimen) => (
            <tr key={specimen.specimenId}>
              <td>{specimen.specimenId}</td>
              <td>{specimen.location}</td>
              <td>
                <img
                  src={`/${specimen.imageUrl}`}  // note the leading slash here
                  alt={`Specimen ${specimen.specimenId}`}
                  style={{ width: 100, height: "auto" }}
                />
              </td>
              <td>{specimen.plantId}</td>
              {!visitorMode && (
                <td>
                  <button onClick={() => startEdit(specimen)}>
                    {t("button.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(specimen.specimenId)}
                    style={{ marginLeft: 5 }}
                  >
                    {t("button.delete")}
                  </button>
                </td>
              )}
            </tr>
          ))}
          {specimens.length === 0 && (
            <tr>
              <td colSpan={visitorMode ? 4 : 5} style={{ textAlign: "center" }}>
                {t("message.noSpecimens")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

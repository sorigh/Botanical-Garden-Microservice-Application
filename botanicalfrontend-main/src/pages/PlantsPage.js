import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";

const API_URL = "http://localhost:8085/plant-service/plants";

export default function PlantsPage({ visitorMode = false }) {
  const { t } = useTranslation();

  const [plants, setPlants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    plantId: "",
    name: "",
    type: "",
    species: "",
    carnivore: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(t("error.fetchPlants"));
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const onSelect = (plant) => {
    setSelected(plant);
    setForm({ ...plant });
  };

  const onClear = () => {
    setSelected(null);
    setForm({ plantId: "", name: "", type: "", species: "", carnivore: false });
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onAdd = async () => {
    setSaving(true);
    setError(null);
    try {
      const { plantId, ...data } = form;
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(t("error.addPlant"));
      await fetchPlants();
      onClear();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const onUpdate = async () => {
    if (!form.plantId) return alert(t("alert.selectToUpdate"));
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${form.plantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(t("error.updatePlant"));
      await fetchPlants();
      onClear();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!form.plantId) return alert(t("alert.selectToDelete"));
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${form.plantId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(t("error.deletePlant"));
      await fetchPlants();
      onClear();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const onExport = async (format = "csv") => {
    try {
      const res = await fetch(`${API_URL}/export?format=${format}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error(t("error.export"));

      const blob = await res.blob();
      const timestamp = new Date().toISOString().split("T")[0];
      const extension = format.toLowerCase();

      saveAs(blob, `plants_export_${timestamp}.${extension}`);
    } catch (err) {
      alert(t("error.export") + ": " + err.message);
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{t("title.plants")}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ maxHeight: 300, overflowY: "auto", flex: 1, border: "1px solid #ccc" }}>
          {loading ? (
            <p>{t("loading.plants")}</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>{t("label.id")}</th>
                  <th>{t("label.name")}</th>
                  <th>{t("label.type")}</th>
                  <th>{t("label.species")}</th>
                  <th>{t("label.carnivore")}</th>
                </tr>
              </thead>
              <tbody>
                {plants.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      {t("message.noPlants")}
                    </td>
                  </tr>
                ) : (
                  plants.map((p) => (
                    <tr
                      key={p.plantId}
                      onClick={() => onSelect(p)}
                      style={{
                        backgroundColor: selected?.plantId === p.plantId ? "#def" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <td>{p.plantId}</td>
                      <td>{p.name}</td>
                      <td>{p.type}</td>
                      <td>{p.species}</td>
                      <td>{p.carnivore ? t("yes") : t("no")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ minWidth: 300 }}>
          <div>
            <label>{t("label.id")}:</label>
            <input type="text" value={form.plantId} readOnly style={{ width: "100%" }} />
          </div>
          <div>
            <label>{t("label.name")}:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              style={{ width: "100%" }}
              disabled={visitorMode}
            />
          </div>
          <div>
            <label>{t("label.type")}:</label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={onChange}
              style={{ width: "100%" }}
              disabled={visitorMode}
            />
          </div>
          <div>
            <label>{t("label.species")}:</label>
            <input
              type="text"
              name="species"
              value={form.species}
              onChange={onChange}
              style={{ width: "100%" }}
              disabled={visitorMode}
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="carnivore"
                checked={form.carnivore}
                onChange={onChange}
                disabled={visitorMode}
              />{" "}
              {t("label.carnivore")}
            </label>
          </div>

          {!visitorMode && (
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button onClick={onAdd} disabled={saving}>{t("button.add")}</button>
              <button onClick={onUpdate} disabled={saving}>{t("button.update")}</button>
              <button onClick={onDelete} disabled={saving}>{t("button.delete")}</button>
              <button onClick={onClear} disabled={saving}>{t("button.clear")}</button>
              <button onClick={() => onExport("CSV")} disabled={saving}>{t("button.exportCSV")}</button>
              <button onClick={() => onExport("DOC")} disabled={saving}>{t("button.exportDOC")}</button>
              <button onClick={() => onExport("JSON")} disabled={saving}>{t("button.exportJSON")}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

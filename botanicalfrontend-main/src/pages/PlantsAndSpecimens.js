import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PlantsStatistics from "./PlantsStatistics";
import { Document, Packer, Paragraph, ImageRun } from "docx";
import { saveAs } from "file-saver";

const PLANTS_API = "http://localhost:8085/plant-service/plants";
const SPECIMENS_API = "http://localhost:8085/specimen-service/specimens";

export default function PlantsAndSpecimensPage({ visitorMode = false, manager = false }) {
  const { t } = useTranslation();

  // --- Plants state ---
  const [plants, setPlants] = useState([]);
  const [plantsLoading, setPlantsLoading] = useState(false);
  const [plantsError, setPlantsError] = useState(null);

  // --- Search / Filter / Sort state ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCarnivore, setFilterCarnivore] = useState("all"); // all, yes, no
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // --- Specimens state ---
  const [specimens, setSpecimens] = useState([]);
  const [specimensLoading, setSpecimensLoading] = useState(false);
  const [specimensError, setSpecimensError] = useState(null);
  const [specimensForm, setSpecimensForm] = useState({
    specimenId: null,
    location: "",
    imageUrl: "",
    plantId: "",
  });
  const [specimensEditing, setSpecimensEditing] = useState(false);

  // Ref to get chart images from PlantsStatistics
  const statsRef = useRef();

  // --- Fetch plants ---
  const fetchPlants = useCallback(async () => {
    setPlantsLoading(true);
    setPlantsError(null);
    try {
      const res = await fetch(PLANTS_API);
      if (!res.ok) throw new Error(t("errors.fetchPlantsFailed"));
      const data = await res.json();
      setPlants(data);
    } catch (err) {
      setPlantsError(err.message);
    } finally {
      setPlantsLoading(false);
    }
  }, [t]);

  // --- Fetch specimens ---
  const fetchSpecimens = useCallback(async () => {
    setSpecimensLoading(true);
    setSpecimensError(null);
    try {
      const res = await fetch(SPECIMENS_API);
      if (!res.ok) throw new Error(t("errors.fetchSpecimensFailed"));
      const data = await res.json();
      setSpecimens(data);
    } catch (err) {
      setSpecimensError(err.message);
    } finally {
      setSpecimensLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchPlants();
    fetchSpecimens();
  }, [fetchPlants, fetchSpecimens]);
  // --- Filtered, searched, sorted plants list ---
  const filteredPlants = useMemo(() => {
  let filtered = plants;

  if (filterCarnivore === "yes") {
    filtered = filtered.filter((p) => p.carnivore === true);
  } else if (filterCarnivore === "no") {
    filtered = filtered.filter((p) => p.carnivore === false);
  }

  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.type.toLowerCase().includes(term) ||
        p.species.toLowerCase().includes(term)
    );
  }

  if (sortField) {
    filtered = filtered.slice().sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === "boolean") valA = valA ? 1 : 0;
      if (typeof valB === "boolean") valB = valB ? 1 : 0;

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  return filtered;
}, [plants, filterCarnivore, searchTerm, sortField, sortAsc]);

  // --- Sorting click handler ---
  const onSortClick = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // --- Specimens handlers ---
  const onSpecimensFormChange = (e) => {
    if (visitorMode) return;
    const { name, value } = e.target;
    setSpecimensForm((f) => ({ ...f, [name]: value }));
  };

  const submitSpecimensForm = async (e) => {
    if (visitorMode) return;
    e.preventDefault();
    try {
      const method = specimensEditing ? "PUT" : "POST";
      const url = specimensEditing
        ? `${SPECIMENS_API}/${specimensForm.specimenId}`
        : SPECIMENS_API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: specimensForm.location,
          imageUrl: specimensForm.imageUrl,
          plantId: parseInt(specimensForm.plantId, 10),
        }),
      });
      if (!res.ok) throw new Error(t("errors.saveSpecimenFailed"));
      await fetchSpecimens();
      setSpecimensForm({ specimenId: null, location: "", imageUrl: "", plantId: "" });
      setSpecimensEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteSpecimen = async (id) => {
    if (visitorMode) return;
    if (!window.confirm(t("confirmations.deleteSpecimen"))) return;
    try {
      const res = await fetch(`${SPECIMENS_API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(t("errors.deleteSpecimenFailed"));
      await fetchSpecimens();
    } catch (err) {
      alert(err.message);
    }
  };

  const editSpecimen = (specimen) => {
    if (visitorMode) return;
    setSpecimensForm({
      specimenId: specimen.specimenId,
      location: specimen.location,
      imageUrl: specimen.imageUrl,
      plantId: specimen.plantId.toString(),
    });
    setSpecimensEditing(true);
  };

  const cancelSpecimenEdit = () => {
    if (visitorMode) return;
    setSpecimensForm({ specimenId: null, location: "", imageUrl: "", plantId: "" });
    setSpecimensEditing(false);
  };

  // --- Export Plants Statistics to Word ---
  const exportStatisticsToWord = async () => {
    if (!statsRef.current) {
      alert("Statistics not available");
      return;
    }

    // Assume statsRef.current.getChartImages() returns Promise<string[]> base64 images of the charts
    const imagesBase64 = await statsRef.current.getChartImages();

    // Create docx document
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: t("plants.statistics.title"),
              heading: "Heading1",
            }),
            ...imagesBase64.map(
              (base64, i) =>
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: Buffer.from(base64.split(",")[1], "base64"),
                      transformation: { width: 600, height: 400 },
                    }),
                  ],
                })
            ),
          ],
        },
      ],
    });

    const packer = new Packer();
    const blob = await packer.toBlob(doc);
    saveAs(blob, "plants-statistics.docx");
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Plants Section */}
      <section style={{ marginBottom: 40 }}>
        <h2>{t("plants.title")}</h2>
        {plantsError && <p style={{ color: "red" }}>{plantsError}</p>}

        {/* Search and Filter */}
        <div style={{ marginBottom: 10, display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder={t("plants.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flexGrow: 1, padding: "6px 8px" }}
          />
          <select
            value={filterCarnivore}
            onChange={(e) => setFilterCarnivore(e.target.value)}
            style={{ padding: "6px 8px" }}
          >
            <option value="all">{t("plants.filter.all")}</option>
            <option value="yes">{t("plants.filter.carnivoreOnly")}</option>
            <option value="no">{t("plants.filter.nonCarnivoreOnly")}</option>
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCarnivore("all");
              setSortField(null);
            }}
          >
            {t("plants.resetButton")}
          </button>
        </div>

        {plantsLoading ? (
          <p>{t("plants.loading")}</p>
        ) : (
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", marginBottom: 10, borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {["plantId", "name", "type", "species", "carnivore"].map((field) => (
                  <th
                    key={field}
                    onClick={() => onSortClick(field)}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    {field === "plantId"
                      ? t("plants.columns.id")
                      : t(`plants.columns.${field}`)}
                    {sortField === field && (sortAsc ? " ↑" : " ↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPlants.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    {t("plants.noPlantsFound")}
                  </td>
                </tr>
              ) : (
                filteredPlants.map((plant) => (
                  <tr key={plant.plantId}>
                    <td style={{ width: "80px", maxWidth: "100px" }}>{plant.plantId}</td>
                    <td>{plant.name}</td>
                    <td>{plant.type}</td>
                    <td>{plant.species}</td>
                    <td>{plant.carnivore ? t("plants.yes") : t("plants.no")}</td>
                  </tr>
                ))
              )}

              {!visitorMode && <PlantsStatistics plants={filteredPlants} />}
            </tbody>
          </table>
        )}
      </section>

      {/* Plants Statistics Section and export button */}
        {manager && (
        <div style={{ marginTop: 20 }}>
          <h3>{t("plants.statistics.title")}</h3>
          <PlantsStatistics ref={statsRef} plants={filteredPlants} />
          <button onClick={exportStatisticsToWord} style={{ marginTop: 10 }}>
            {t("plants.statistics.exportToWord")}
          </button>
        </div>
      )}

      {/* Specimens Section */}
      <section>
        <h2>{t("specimens.title")}</h2>
        {specimensError && <p style={{ color: "red" }}>{specimensError}</p>}

        {specimensLoading ? (
          <p>{t("specimens.loading")}</p>
        ) : (
          <>
            <table
              border="1"
              cellPadding="8"
              style={{ width: "100%", marginBottom: 10, borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  {["specimenId", "location", "imageUrl", "plantId", "actions"].map((field) => (
                    <th key={field}>
                      {field === "specimenId"
                        ? t("specimens.columns.id")
                        : field === "imageUrl"
                        ? t("specimens.columns.imageUrl")
                        : field === "actions"
                        ? t("specimens.columns.actions")
                        : t(`specimens.columns.${field}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specimens.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      {t("specimens.noSpecimensFound")}
                    </td>
                  </tr>
                ) : (
                  specimens.map((specimen) => (
                    <tr key={specimen.specimenId}>
                      <td>{specimen.specimenId}</td>
                      <td>{specimen.location}</td>
                      <td>
                        {specimen.imageUrl ? (
                          <img
                            src={specimen.imageUrl}
                            alt={t("specimens.imageAlt", { id: specimen.specimenId })}
                            style={{ maxWidth: 100, maxHeight: 70 }}
                          />
                        ) : (
                          t("specimens.noImage")
                        )}
                      </td>
                      <td>{specimen.plantId}</td>
                      <td>
                        {!visitorMode && (
                          <>
                            <button onClick={() => editSpecimen(specimen)}>
                              {t("specimens.editButton")}
                            </button>{" "}
                            <button onClick={() => deleteSpecimen(specimen.specimenId)}>
                              {t("specimens.deleteButton")}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {!visitorMode && (
              <form onSubmit={submitSpecimensForm} style={{ maxWidth: 500 }}>
                <h3>
                  {specimensEditing
                    ? t("specimens.editTitle")
                    : t("specimens.addTitle")}
                </h3>

                <label>
                  {t("specimens.form.locationLabel")}
                  <input
                    name="location"
                    type="text"
                    value={specimensForm.location}
                    onChange={onSpecimensFormChange}
                    required
                    placeholder={t("specimens.form.locationPlaceholder")}
                  />
                </label>
                <br />
                <label>
                  {t("specimens.form.imageUrlLabel")}
                  <input
                    name="imageUrl"
                    type="text"
                    value={specimensForm.imageUrl}
                    onChange={onSpecimensFormChange}
                    placeholder={t("specimens.form.imageUrlPlaceholder")}
                  />
                </label>
                <br />
                <label>
                  {t("specimens.form.plantIdLabel")}
                  <input
                    name="plantId"
                    type="number"
                    min="1"
                    value={specimensForm.plantId}
                    onChange={onSpecimensFormChange}
                    required
                    placeholder={t("specimens.form.plantIdPlaceholder")}
                  />
                </label>
                <br />
                <button type="submit">
                  {specimensEditing
                    ? t("specimens.form.updateButton")
                    : t("specimens.form.addButton")}
                </button>{" "}
                {specimensEditing && (
                  <button type="button" onClick={cancelSpecimenEdit}>
                    {t("specimens.form.cancelButton")}
                  </button>
                )}
              </form>
            )}
          </>
        )}
      </section>
    </div>
  );
}

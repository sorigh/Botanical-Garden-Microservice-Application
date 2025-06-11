// src/api.js

const API_BASE = "http://localhost:8085";

const PLANTS_API = `${API_BASE}/plant-service/plants`;
const SPECIMENS_API = `${API_BASE}/specimen-service/specimens`;

// Plants API
export async function fetchPlants() {
  const res = await fetch(PLANTS_API);
  if (!res.ok) throw new Error("Failed to fetch plants");
  return res.json();
}

export async function addPlant(plant) {
  const res = await fetch(PLANTS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  if (!res.ok) throw new Error("Failed to add plant");
  return res.json();
}

export async function updatePlant(plantId, plant) {
  const res = await fetch(`${PLANTS_API}/${plantId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plant),
  });
  if (!res.ok) throw new Error("Failed to update plant");
  return res.json();
}

export async function deletePlant(plantId) {
  const res = await fetch(`${PLANTS_API}/${plantId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete plant");
}

// Specimens API
export async function fetchSpecimens() {
  const res = await fetch(SPECIMENS_API);
  if (!res.ok) throw new Error("Failed to fetch specimens");
  return res.json();
}

export async function addSpecimen(specimen) {
  const res = await fetch(SPECIMENS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(specimen),
  });
  if (!res.ok) throw new Error("Failed to add specimen");
  return res.json();
}

export async function updateSpecimen(specimenId, specimen) {
  const res = await fetch(`${SPECIMENS_API}/${specimenId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(specimen),
  });
  if (!res.ok) throw new Error("Failed to update specimen");
  return res.json();
}

export async function deleteSpecimen(specimenId) {
  const res = await fetch(`${SPECIMENS_API}/${specimenId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete specimen");
}

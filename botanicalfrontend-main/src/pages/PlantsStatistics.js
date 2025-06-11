import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function PlantsStatistics({ plants }) {
  // Example: Count number of plants per species
  const plantsBySpecies = Object.values(
    plants.reduce((acc, plant) => {
      acc[plant.species] = acc[plant.species] || { name: plant.species, count: 0 };
      acc[plant.species].count++;
      return acc;
    }, {})
  );

  // Example: Count carnivore vs non-carnivore
  const carnivoreStats = [
    {
      name: "Carnivore",
      value: plants.filter((p) => p.carnivore).length,
    },
    {
      name: "Non-Carnivore",
      value: plants.filter((p) => !p.carnivore).length,
    },
  ];

  // Example: Count plants by type
  const plantsByType = Object.values(
    plants.reduce((acc, plant) => {
      acc[plant.type] = acc[plant.type] || { type: plant.type, count: 0 };
      acc[plant.type].count++;
      return acc;
    }, {})
  );

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Plant Statistics</h3>
      <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
        {/* BarChart by species */}
        <div style={{ width: "100%", height: 300 }}>
          <h4>Plants per Species</h4>
          <ResponsiveContainer>
            <BarChart data={plantsBySpecies}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PieChart carnivorous vs non */}
        <div style={{ width: 400, height: 300 }}>
          <h4>Carnivorous vs Non-Carnivorous</h4>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={carnivoreStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {carnivoreStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BarChart by type */}
        <div style={{ width: "100%", height: 300 }}>
          <h4>Plants per Type</h4>
          <ResponsiveContainer>
            <BarChart data={plantsByType}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

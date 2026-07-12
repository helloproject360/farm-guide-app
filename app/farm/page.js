"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const EMPTY = {
  name: "",
  municipality: "",
  barangay: "",
  size_ha: "",
  farm_type: "rural",
  existing_crops: "",
  water_source: "",
  soil_notes: "",
  near_mangroves: false,
  notes: "",
};

export default function FarmForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null); // 'saving' | 'saved' | 'error'
  const [message, setMessage] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supabase) {
      setStatus("error");
      setMessage("The app is not connected to the database yet.");
      return;
    }
    setStatus("saving");
    setMessage("");
    const row = { ...form, size_ha: form.size_ha ? Number(form.size_ha) : null };
    const { error } = await supabase.from("farms").insert(row);
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("saved");
      setMessage("Your farm is saved!");
      setForm(EMPTY);
    }
  }

  const label = { display: "block", fontWeight: 600, marginBottom: 6, marginTop: 16 };
  const input = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #cdd8cd",
    borderRadius: 8,
    fontSize: "1rem",
    fontFamily: "inherit",
  };

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">🌱 My Farm</div>
        <h1>Tell us about your land</h1>
        <p className="tagline">We use this to guide you. You can change it later.</p>
      </section>

      <form className="card" onSubmit={handleSubmit}>
        <label style={label}>Farm name</label>
        <input style={input} value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Our coconut land" />

        <label style={label}>Town (municipality)</label>
        <input style={input} value={form.municipality}
          onChange={(e) => update("municipality", e.target.value)}
          placeholder="e.g. Brooke's Point" />

        <label style={label}>Barangay</label>
        <input style={input} value={form.barangay}
          onChange={(e) => update("barangay", e.target.value)}
          placeholder="e.g. Maasin" />

        <label style={label}>Land size (hectares)</label>
        <input style={input} type="number" step="0.1" value={form.size_ha}
          onChange={(e) => update("size_ha", e.target.value)}
          placeholder="e.g. 1" />

        <label style={label}>Farm type</label>
        <select style={input} value={form.farm_type}
          onChange={(e) => update("farm_type", e.target.value)}>
          <option value="rural">Countryside land</option>
          <option value="community">Community garden</option>
          <option value="urban">Home / urban garden</option>
        </select>

        <label style={label}>What is growing now?</label>
        <input style={input} value={form.existing_crops}
          onChange={(e) => update("existing_crops", e.target.value)}
          placeholder="e.g. Old coconut trees" />

        <label style={label}>Water source</label>
        <input style={input} value={form.water_source}
          onChange={(e) => update("water_source", e.target.value)}
          placeholder="e.g. Rain, creek, deep well" />

        <label style={label}>Soil notes (optional)</label>
        <input style={input} value={form.soil_notes}
          onChange={(e) => update("soil_notes", e.target.value)}
          placeholder="e.g. Clay, sandy, often wet" />

        <label style={{ ...label, display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={form.near_mangroves}
            onChange={(e) => update("near_mangroves", e.target.checked)} />
          My land is near mangroves
        </label>

        <label style={label}>Anything else? (optional)</label>
        <textarea style={{ ...input, minHeight: 80 }} value={form.notes}
          onChange={(e) => update("notes", e.target.value)} />

        <button type="submit" disabled={status === "saving"}
          style={{
            marginTop: 24, width: "100%", padding: 12, background: "#2e7d32",
            color: "#fff", border: "none", borderRadius: 8, fontSize: "1rem",
            fontWeight: 600, cursor: "pointer",
          }}>
          {status === "saving" ? "Saving..." : "Save my farm"}
        </button>

        {message ? (
          <p style={{ marginTop: 16, fontWeight: 600, color: status === "error" ? "#b3261e" : "#2e7d32" }}>
            {message}
          </p>
        ) : null}
      </form>

      <footer className="footer">
        <a href="/" style={{ color: "#667a6e" }}>← Back to home</a>
      </footer>
    </main>
  );
}

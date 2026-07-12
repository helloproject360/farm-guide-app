"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_LONG = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

// Brooke's Point, Palawan: wet season ~May-Nov (heaviest Jul-Aug), dry ~Dec-Apr.
function isWet(month) { return month >= 5 && month <= 11; }
// PH typhoon season Jun-Nov (peak Jul-Oct). Southern Palawan is usually sheltered.
function isTyphoonWindow(month) { return month >= 6 && month <= 11; }

function plantableThisMonth(crop, month) {
  const text = (crop.season || "").toLowerCase();
  const wet = isWet(month);
  if (text.includes("any")) return true;
  if (text.includes("rainy") || text.includes("wet")) return wet;
  if (text.includes("dry")) return !wet;
  return wet;
}

export default function Calendar() {
  const now = new Date().getMonth() + 1;
  const [month, setMonth] = useState(now);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!supabase) { setError("The app is not connected to the database yet."); setLoading(false); return; }
      const { data, error: e } = await supabase.from("crops").select("*").order("name", { ascending: true });
      if (e) { setError(e.message); setLoading(false); return; }
      setCrops(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const wet = isWet(month);
  const typhoon = isTyphoonWindow(month);
  const toPlant = crops.filter((c) => plantableThisMonth(c, month));

  const pill = (m) => ({
    padding: "8px 12px", borderRadius: 999, cursor: "pointer", fontWeight: 600,
    border: "1px solid " + (m === month ? "#2e7d32" : "#cdd8cd"),
    background: m === month ? "#2e7d32" : "#fff",
    color: m === month ? "#fff" : "#2e7d32",
  });

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">🌱 Planting calendar</div>
        <h1>What to plant, month by month</h1>
        <p className="tagline">Tap a month. Made for Brooke&apos;s Point, Palawan.</p>
      </section>

      <section className="card">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {MONTHS_SHORT.map((m, i) => (
            <button key={i} style={pill(i + 1)} onClick={() => setMonth(i + 1)}>{m}</button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginBottom: 6 }}>
          {wet ? "🌧️ " : "☀️ "}{MONTHS_LONG[month - 1]} — {wet ? "wet season" : "dry season"}
        </h2>
        <p className="muted" style={{ marginTop: 0 }}>
          {wet
            ? "Rain waters your plants for free. Good time to start most crops."
            : "Drier days. Plant crops that like sun, and water them if you can."}
        </p>
        {typhoon ? (
          <p style={{ marginTop: 10, color: "#8a6d00", background: "#fff7e0", padding: "10px 12px", borderRadius: 8 }}>
            ⚠️ Typhoon season in the Philippines (June to November). Southern Palawan is usually sheltered, but a storm can still pass. Stake young trees and avoid planting tall, top-heavy crops right before a warning.
          </p>
        ) : null}
      </section>

      {loading ? (
        <section className="card"><p>Loading crops...</p></section>
      ) : error ? (
        <section className="card"><p style={{ color: "#b3261e" }}>{error}</p></section>
      ) : (
        <section className="card">
          <h2 style={{ marginBottom: 12 }}>Good to plant in {MONTHS_LONG[month - 1]}</h2>
          {toPlant.length === 0 ? (
            <p>No crops matched for this month. Try another month.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {toPlant.map((c) => (
                <div key={c.id}>
                  <strong>{c.name}</strong>
                  {c.name_tl ? <span style={{ color: "#667a6e" }}> · {c.name_tl}</span> : null}
                  <div className="muted" style={{ fontSize: "0.9rem" }}>
                    {c.months_to_harvest ? "Harvest in ~" + c.months_to_harvest + " months" : ""}
                    {c.farmgate_price_php ? " · ~₱" + c.farmgate_price_php + "/kg" : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <footer className="footer">
        <a href="/" style={{ color: "#667a6e" }}>← Back to home</a>
      </footer>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

// Palawan: rainy (habagat) ~ Jun-Nov, dry ~ Dec-May
function currentSeason(month) {
  return month >= 6 && month <= 11 ? "rainy" : "dry";
}

export default function Recommend() {
  const [farm, setFarm] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const month = new Date().getMonth() + 1;
  const season = currentSeason(month);

  useEffect(() => {
    async function load() {
      if (!supabase) {
        setError("The app is not connected to the database yet.");
        setLoading(false);
        return;
      }
      const { data: farms, error: fErr } = await supabase
        .from("farms").select("*").order("id", { ascending: false }).limit(1);
      if (fErr) { setError(fErr.message); setLoading(false); return; }
      const f = farms && farms[0];
      setFarm(f || null);

      const { data: crops, error: cErr } = await supabase.from("crops").select("*");
      if (cErr) { setError(cErr.message); setLoading(false); return; }

      const hasCoconut = f && (f.existing_crops || "").toLowerCase().includes("coconut");

      const scored = (crops || []).map((c) => {
        let score = 0;
        const reasons = [];
        const cropSeason = (c.season || "").toLowerCase();
        if (cropSeason.includes(season) || cropSeason.includes("any")) {
          score += 2;
          reasons.push(season === "rainy"
            ? "Good to plant now (rainy season)"
            : "Good to plant now (dry season)");
        }
        if (hasCoconut && c.intercrop_friendly) {
          score += 3;
          reasons.push("Can grow under your coconut trees");
        }
        const text = ((c.climate_fit || "") + " " + (c.notes || "")).toLowerCase();
        if (text.includes("hardy") || text.includes("low-maintenance") || text.includes("drought")) {
          score += 1;
          reasons.push("Hardy and easy for beginners");
        }
        if (c.months_to_harvest && c.months_to_harvest <= 6) {
          score += 1;
          reasons.push("Quick harvest (money sooner)");
        }
        return { ...c, score, reasons };
      });

      scored.sort((a, b) => b.score - a.score);
      setRecs(scored.filter((c) => c.score > 0).slice(0, 8));
      setLoading(false);
    }
    load();
  }, [season]);

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">🌱 What to plant</div>
        <h1>Your crop suggestions</h1>
        <p className="tagline">
          For {MONTHS[month - 1]} — {season === "rainy" ? "rainy season" : "dry season"} in Palawan.
        </p>
      </section>

      {loading ? (
        <section className="card"><p>Loading your suggestions...</p></section>
      ) : error ? (
        <section className="card"><p style={{ color: "#b3261e" }}>{error}</p></section>
      ) : !farm ? (
        <section className="card">
          <p>We could not find a saved farm yet.</p>
          <a href="/farm" style={{ color: "#2e7d32", fontWeight: 600 }}>Set up your farm first →</a>
        </section>
      ) : (
        <>
          <section className="card">
            <h2>Based on your land</h2>
            <p className="muted" style={{ marginTop: 6 }}>
              {farm.name ? farm.name + " — " : ""}
              {[farm.barangay, farm.municipality].filter(Boolean).join(", ")}
              {farm.existing_crops ? " · Now growing: " + farm.existing_crops : ""}
            </p>
          </section>

          {recs.map((c) => (
            <section className="card" key={c.id}>
              <h2 style={{ marginBottom: 4 }}>
                {c.name}{c.name_tl ? <span style={{ color: "#667a6e", fontWeight: 400 }}> · {c.name_tl}</span> : null}
              </h2>
              <p className="muted" style={{ marginTop: 0, marginBottom: 10 }}>
                {c.months_to_harvest ? "Harvest in ~" + c.months_to_harvest + " months" : ""}
                {c.farmgate_price_php ? " · ~₱" + c.farmgate_price_php + "/kg farmgate" : ""}
              </p>
              <ul>
                {c.reasons.map((r, i) => (<li key={i}>{r}</li>))}
              </ul>
              {c.notes ? <p className="muted" style={{ marginTop: 10 }}>{c.notes}</p> : null}
            </section>
          ))}

          {recs.length === 0 ? (
            <section className="card"><p>No strong matches this month. Check back next season.</p></section>
          ) : null}
        </>
      )}

      <footer className="footer">
        <a href="/" style={{ color: "#667a6e" }}>← Back to home</a>
      </footer>
    </main>
  );
}

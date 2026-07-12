"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function renderBody(body) {
  const lines = (body || "").split("\n");
  const blocks = [];
  let list = null;
  const flush = () => { if (list) { blocks.push(list); list = null; } };
  lines.forEach((raw) => {
    const line = raw.trimEnd();
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h", text: line.slice(3) });
    } else if (line.startsWith("- ")) {
      if (!list || list.type !== "ul") { flush(); list = { type: "ul", items: [] }; }
      list.items.push(line.slice(2));
    } else if (/^\d+\.\s/.test(line)) {
      if (!list || list.type !== "ol") { flush(); list = { type: "ol", items: [] }; }
      list.items.push(line.replace(/^\d+\.\s/, ""));
    } else if (line.trim() === "") {
      flush();
    } else {
      flush();
      blocks.push({ type: "p", text: line });
    }
  });
  flush();
  return blocks;
}

function GuideBody({ body }) {
  const blocks = renderBody(body);
  return (
    <div style={{ marginTop: 12 }}>
      {blocks.map((b, i) => {
        if (b.type === "h") return <h3 key={i} style={{ color: "#1b5e20", marginTop: 16, marginBottom: 6 }}>{b.text}</h3>;
        if (b.type === "p") return <p key={i} style={{ marginBottom: 8 }}>{b.text}</p>;
        if (b.type === "ul") return <ul key={i} style={{ paddingLeft: 22, marginBottom: 8, listStyle: "disc" }}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}>{it}</li>)}</ul>;
        if (b.type === "ol") return <ol key={i} style={{ paddingLeft: 22, marginBottom: 8 }}>{b.items.map((it, j) => <li key={j} style={{ marginBottom: 4 }}>{it}</li>)}</ol>;
        return null;
      })}
    </div>
  );
}

export default function Guides() {
  const [guides, setGuides] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!supabase) { setError("The app is not connected to the database yet."); setLoading(false); return; }
      const { data, error: e } = await supabase.from("guides").select("*").order("id", { ascending: true });
      if (e) { setError(e.message); setLoading(false); return; }
      setGuides(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">🌱 How-to guides</div>
        <h1>Step-by-step guides</h1>
        <p className="tagline">Simple steps for beginners. Tap a guide to read it.</p>
      </section>

      {loading ? (
        <section className="card"><p>Loading guides...</p></section>
      ) : error ? (
        <section className="card"><p style={{ color: "#b3261e" }}>{error}</p></section>
      ) : (
        guides.map((g) => {
          const open = openId === g.id;
          return (
            <section className="card" key={g.id}>
              <button
                onClick={() => setOpenId(open ? null : g.id)}
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none",
                  padding: 0, cursor: "pointer", fontSize: "1.25rem", fontWeight: 700,
                  color: "#1b5e20", display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                <span>{g.title}</span>
                <span style={{ color: "#667a6e" }}>{open ? "–" : "+"}</span>
              </button>
              {open ? (
                <>
                  <GuideBody body={g.body} />
                  {g.source ? <p className="muted" style={{ marginTop: 12, fontSize: "0.85rem" }}>Source: {g.source}</p> : null}
                </>
              ) : null}
            </section>
          );
        })
      )}

      <footer className="footer">
        <a href="/" style={{ color: "#667a6e" }}>← Back to home</a>
      </footer>
    </main>
  );
}

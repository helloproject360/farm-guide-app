import { strings, defaultLang } from "./strings";

export default function Home() {
  const t = strings[defaultLang];

  const btn = {
    display: "inline-block", padding: "12px 20px", borderRadius: 8,
    textDecoration: "none", fontWeight: 600,
  };
  const outline = { ...btn, background: "#fff", color: "#2e7d32", border: "2px solid #2e7d32" };

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">🌱 {t.appName}</div>
        <h1>{t.heroLine1}</h1>
        <h1 className="accent">{t.heroLine2}</h1>
        <p className="tagline">{t.tagline}</p>
      </section>

      <section className="card">
        <h2>{t.whatItDoes}</h2>
        <ul>
          <li>{t.feature1}</li>
          <li>{t.feature2}</li>
          <li>{t.feature3}</li>
        </ul>
        <p className="muted">{t.comingSoon}</p>
        <div style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a href="/farm" style={{ ...btn, background: "#2e7d32", color: "#fff" }}>Set up my farm →</a>
          <a href="/recommend" style={outline}>See what to plant →</a>
          <a href="/guides" style={outline}>Read the guides →</a>
        </div>
      </section>

      <footer className="footer">{t.footer}</footer>
    </main>
  );
}

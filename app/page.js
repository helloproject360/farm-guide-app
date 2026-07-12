import { strings, defaultLang } from "./strings";

export default function Home() {
  const t = strings[defaultLang];

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
          <a href="/farm"
            style={{
              display: "inline-block", padding: "12px 20px",
              background: "#2e7d32", color: "#fff", borderRadius: 8,
              textDecoration: "none", fontWeight: 600,
            }}>
            Set up my farm →
          </a>
          <a href="/recommend"
            style={{
              display: "inline-block", padding: "12px 20px",
              background: "#fff", color: "#2e7d32", border: "2px solid #2e7d32",
              borderRadius: 8, textDecoration: "none", fontWeight: 600,
            }}>
            See what to plant →
          </a>
        </div>
      </section>

      <footer className="footer">{t.footer}</footer>
    </main>
  );
}

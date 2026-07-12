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
      </section>

      <footer className="footer">{t.footer}</footer>
    </main>
  );
}

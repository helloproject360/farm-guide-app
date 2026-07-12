# Farm Guide App

A guide that turns complete beginners into earning farmers. Palawan first.

This is the **S0.1 skeleton** — a live landing page. Real features come next (see ROADMAP.md).

Built with Next.js (React). Runs free on Vercel + Supabase. Written to be simple enough for a first-time farmer to read.

---

## What's in here

- `app/page.js` — the landing page you see.
- `app/strings.js` — **all the words** on the app, in one place. English now, Tagalog later.
- `app/globals.css` — the colors and styling.
- `app/layout.js` — the page wrapper.

---

## Run it on your own computer (optional — to see it before it's online)

You need **Node.js** installed first (free): https://nodejs.org (get the "LTS" version).

Then, in a terminal, inside this folder:

```bash
npm install      # gets the building blocks (only needed once)
npm run dev      # starts the app
```

Open **http://localhost:3000** in your browser. You'll see the page. Press `Ctrl+C` in the terminal to stop.

---

## Put it online for free (the "live URL" goal of S0.1)

You'll do this once. You need two free accounts: **GitHub** (stores the code) and **Vercel** (puts it online).

1. **Make a GitHub account:** https://github.com (free).
2. **Upload this folder to GitHub** as a new repository. Easiest way for a non-coder: install **GitHub Desktop** (https://desktop.github.com), click *Add* → *Add Existing Repository*, point it at this folder, then *Publish*.
3. **Make a Vercel account:** https://vercel.com — sign in with your GitHub account.
4. In Vercel, click **Add New → Project**, pick your `farm-guide-app` repository, and click **Deploy**. Leave all settings default — Vercel knows Next.js.
5. After a minute, Vercel gives you a live link like `farm-guide-app.vercel.app`. That's your app on the internet. 🎉

From then on, every time the code updates on GitHub, Vercel updates the live site automatically.

---

## Next step

Session **S0.2** in ROADMAP.md: create the free Supabase database and save the coconut farm as the first record. Then **S1.1**: build the farm profile form.

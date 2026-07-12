import "./globals.css";

export const metadata = {
  title: "Farm Guide",
  description: "A guide that helps new farmers earn from their land. Palawan first.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { LearnerProvider } from "@/context/LearnerContext";
import { APP_NAME } from "@/lib/brand";

// Nunito is an open-licence rounded typeface close in feel to the original's custom font.
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800", "900"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: `${APP_NAME} – learn a language for free`,
  description: "A gamified language-learning app",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#131f24" };

// Dark is the default look (as in the reference screenshots); "light" can be chosen in Settings.
// Runs before first paint so the theme doesn't flash.
const themeScript = `try{if(localStorage.getItem('theme')!=='light')document.documentElement.classList.add('dark')}catch(e){document.documentElement.classList.add('dark')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <LearnerProvider>{children}</LearnerProvider>
      </body>
    </html>
  );
}

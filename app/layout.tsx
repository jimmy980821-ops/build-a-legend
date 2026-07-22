import type { Metadata, Viewport } from "next";
import "./globals.css";

const githubBasePath = process.env.GITHUB_PAGES === "true" ? "/build-a-legend" : "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "FULL COURT LAB｜籃球遊戲系列",
  description: "手機籃球遊戲館：打造夢幻球星、挑戰82勝完美賽季，更多籃球知識遊戲即將上線。",
  applicationName: "FULL COURT LAB",
  icons: {
    icon: [{ url: `${githubBasePath}/favicon-basketball.png`, type: "image/png" }],
    apple: [{ url: `${githubBasePath}/favicon-basketball.png`, type: "image/png" }],
  },
  openGraph: {
    title: "FULL COURT LAB｜籃球遊戲系列",
    description: "打造球星、組建跨年代夢幻隊，挑戰你的籃球知識。",
    type: "website",
    images: [{ url: "/og-full-court-lab.png", width: 1672, height: 941, alt: "FULL COURT LAB 籃球遊戲系列" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FULL COURT LAB｜籃球遊戲系列",
    description: "兩款手機籃球遊戲立即開玩，更多玩法即將上線。",
    images: ["/og-full-court-lab.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0d10",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hant"><body>{children}</body></html>;
}

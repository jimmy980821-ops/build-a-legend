import type { Metadata, Viewport } from "next";
import "./globals.css";

const githubBasePath = process.env.GITHUB_PAGES === "true" ? "/build-a-legend" : "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "BUILD-A-LEGEND｜打造你的夢幻球星",
  description: "先抽球隊、再選球員，奪取 13 項能力，打造專屬夢幻球星。手機瀏覽器直接開玩。",
  applicationName: "BUILD-A-LEGEND",
  icons: {
    icon: [{ url: `${githubBasePath}/favicon-basketball.png`, type: "image/png" }],
    apple: [{ url: `${githubBasePath}/favicon-basketball.png`, type: "image/png" }],
  },
  openGraph: {
    title: "BUILD-A-LEGEND｜打造你的夢幻球星",
    description: "抽球隊、選球員、奪取 13 項能力，完成你的傳奇球員卡。",
    type: "website",
    images: [{ url: "/og-13-attributes.png", width: 1672, height: 941, alt: "BUILD-A-LEGEND 遊戲預覽" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BUILD-A-LEGEND｜打造你的夢幻球星",
    description: "30 支球隊、13 項能力，打造球星並模擬新秀賽季。",
    images: ["/og-13-attributes.png"],
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

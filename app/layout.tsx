import type { Metadata } from "next";
import { Noto_Sans_KR, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { MswProvider } from "@/app/msw-provider";
import { QueryProvider } from "@/app/query-provider";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // 실제 사용하는 weight만 로드
  display: "swap", // 폰트 로딩 최적화
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // 실제 사용하는 weight만 로드
  display: "swap", // 폰트 로딩 최적화
});

export const metadata: Metadata = {
  title: "CV Mento",
  description: "AIBE2_FinalProject_CodeHansabari_FE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.variable} ${roboto.variable} antialiased`}>
        <MswProvider>
          <QueryProvider>{children}</QueryProvider>
        </MswProvider>
      </body>
    </html>
  );
}

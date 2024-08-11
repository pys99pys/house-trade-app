import type { Metadata } from "next";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "아파트 실거래가 조회",
  description: "아파트 실거래가 조회",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header>
          <h1>아파트 실거래가 조회</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

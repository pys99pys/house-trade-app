import type { Metadata } from "next";
import Link from "next/link";

import { TRADE_LIST_PATH } from "@/constants/paths";
import "@/styles/globals.css";

import styles from "./layout.module.css";

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
        <header className={styles.header}>
          <h1>
            <Link href={TRADE_LIST_PATH} className={styles.logo}>
              아파트 실거래가 조회
            </Link>
          </h1>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}

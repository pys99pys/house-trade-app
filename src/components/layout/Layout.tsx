import Link from "next/link";
import { FC, ReactNode } from "react";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <header className={styles.header}>
        <div />
        <h1>아파트 실거래가 조회</h1>
        <nav>
          <Link href="">실거래가 조회</Link>
          <Link href="">저장 목록</Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Layout;

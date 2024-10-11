import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { RecoilRoot } from "recoil";

import { SAVED_LIST_PATH, TRADE_LIST_PATH } from "@/constants/paths";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { push } = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setClientState = () => {
    setIsClient(true);
  };

  const setMobileClassName = () => {
    setIsMobile(window.innerWidth <= 640);
  };

  useEffect(() => {
    setClientState();
    setMobileClassName();
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <RecoilRoot>
        <div className={classNames(styles.layout, { [styles.mobile]: isMobile })}>
          <header className={styles.header}>
            <div className={styles.container}>
              <h1 role="button" onClick={onClick}>
                <FaRegBuilding className={styles.logo} />
                <span className={styles.text}>아파트 실거래가 조회</span>
              </h1>
              <nav>
                <Link href={TRADE_LIST_PATH} className={classNames({ [styles.active]: pathname === TRADE_LIST_PATH })}>
                  실거래가 조회
                </Link>
                <Link href={SAVED_LIST_PATH} className={classNames({ [styles.active]: pathname === SAVED_LIST_PATH })}>
                  저장 목록
                </Link>
              </nav>
            </div>
          </header>
          <main className={styles.main}>{children}</main>
        </div>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default Layout;

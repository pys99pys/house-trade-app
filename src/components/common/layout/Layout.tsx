import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { RecoilRoot } from "recoil";

import { TRADE_LIST_PATH } from "@/constants/paths";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { push } = useRouter();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  const onClick = () => {
    if (pathname === TRADE_LIST_PATH) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      push(TRADE_LIST_PATH);
    }
  };

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <RecoilRoot>
        <header className={styles.header}>
          <h1 role="button" onClick={onClick}>
            <FaRegBuilding className={styles.logo} />
            <span className={styles.text}>아파트 실거래가 조회</span>
          </h1>
        </header>
        <main className={styles.main}>{children}</main>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default Layout;

import classNames from "classnames";
import { usePathname } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { FaRegBuilding } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { MIGRATION_PATH, SAVED_LIST_PATH, TRADE_LIST_PATH } from "@/constants/paths";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const routes = [
  {
    path: TRADE_LIST_PATH,
    name: "실거래가 조회",
  },
  {
    path: SAVED_LIST_PATH,
    name: "저장 목록",
  },
  // {
  //   path: MIGRATION_PATH,
  //   name: "업로드",
  // },
];

const Layout: FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setIsMobile(window.innerWidth <= 640);
  }, []);

  return (
    <RecoilRoot>
      <div className={classNames(styles.layout, { [styles.mobile]: isMobile })}>
        <header className={styles.header}>
          <div className={styles.container}>
            <h1 role="button" onClick={onClick}>
              <FaRegBuilding className={styles.logo} />
              <span className={styles.text}>아파트 실거래가 조회</span>
            </h1>
            <nav>
              {routes.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={classNames({ [styles.active]: pathname === item.path })}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </RecoilRoot>
  );
};

export default Layout;

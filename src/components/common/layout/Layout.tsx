import cx from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode } from "react";
import { FaRegBuilding } from "react-icons/fa";

import { SAVED_LIST_PATH, TRADE_LIST_PATH } from "@/constants/paths";
import { STORAGE_KEY_SEARCH_FORM } from "@/constants/storageKeys";
import { getValue } from "@/utils/storage";

import styles from "./Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const savedSearchForm = getValue<{ cityCode: string; yearMonth: string }>(
    STORAGE_KEY_SEARCH_FORM
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 onClick={() => push(TRADE_LIST_PATH)}>
            <FaRegBuilding className={styles.logo} />
            <span className={styles.text}>아파트 실거래가 조회</span>
          </h1>
          <nav>
            <Link
              href={
                TRADE_LIST_PATH +
                (savedSearchForm
                  ? `?cityCode=${savedSearchForm.cityCode}&yearMonth=${savedSearchForm.yearMonth}`
                  : "")
              }
              className={cx({ [styles.active]: pathname === TRADE_LIST_PATH })}
            >
              실거래가 조회
            </Link>
            <Link
              href={SAVED_LIST_PATH}
              className={cx({ [styles.active]: pathname === SAVED_LIST_PATH })}
            >
              저장 목록
            </Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default Layout;

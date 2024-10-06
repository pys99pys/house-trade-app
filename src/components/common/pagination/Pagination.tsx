import cx from "classnames";
import classNames from "classnames";
import { FC } from "react";

import styles from "./Pagination.module.css";

interface PaginationProps {
  per: number;
  block: number;
  total: number;
  current: number;
  onChange: (page: number) => void;

  size?: "default" | "small";
}

const Pagination: FC<PaginationProps> = ({ per, block, total, current, onChange, size = "default" }) => {
  const last = Math.ceil(total / per);
  const start = Math.floor((current - 1) / block) * block + 1;
  const end = Math.min(start + block - 1, last);
  const pageArray = new Array(end - start + 1).fill(null).map((_, i) => start + i);

  return (
    <ul
      className={classNames(styles.pagination, {
        [styles.small]: size === "small",
      })}
    >
      {start > block && (
        <>
          <li>
            <button onClick={() => onChange(1)}>1</button>
          </li>
          <li>
            <button onClick={() => onChange(start - 1)}>...</button>
          </li>
        </>
      )}

      {pageArray.map((page) => (
        <li key={page}>
          <button className={cx({ [styles.active]: page === current })} onClick={() => onChange(page)}>
            {page}
          </button>
        </li>
      ))}

      {end !== last && (
        <>
          <li>
            <button onClick={() => onChange(end + 1)}>...</button>
          </li>
          <li>
            <button onClick={() => onChange(last)}>{last}</button>
          </li>
        </>
      )}
    </ul>
  );
};

export default Pagination;

import { FC } from "react";
import { FaTimes } from "react-icons/fa";

import Button from "@/components/common/button/Button";

import styles from "./FavoriteList.module.css";
import useFavoriteList from "./useFavoriteList";

interface FavoriteListProps {}

const FavoriteList: FC<FavoriteListProps> = () => {
  const { favoriteList, onClick, onRemove } = useFavoriteList();

  return (
    <div className={styles.favoriteList}>
      <ul>
        {favoriteList.map((item) => (
          <li key={item.cityCode}>
            <Button size="xsmall" onClick={() => onClick(item.cityCode)}>
              {item.label}
              <span
                role="button"
                className={styles.removeIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.cityCode);
                }}
              >
                <FaTimes />
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteList;

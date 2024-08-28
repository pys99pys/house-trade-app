import { FC } from "react";
import { FaTimes } from "react-icons/fa";

import Button from "../common/button/Button";
import styles from "./SavedList.module.css";
import useSavedList from "./useSavedList";

interface SavedListProps {}

const SavedList: FC<SavedListProps> = () => {
  const { list, onClick, removeItem } = useSavedList();

  return (
    <div className={styles.savedList}>
      {list.map((item) => (
        <dl key={item.cityName}>
          <dt>{item.cityName}</dt>
          <dd>
            <ul>
              {item.apartList.map((apartItem) => (
                <li key={JSON.stringify(apartItem)}>
                  <Button size="small" onClick={() => onClick(item.cityCode, apartItem)}>
                    {apartItem.apartName}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.cityCode, apartItem);
                      }}
                    >
                      <FaTimes />
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      ))}
    </div>
  );
};

export default SavedList;

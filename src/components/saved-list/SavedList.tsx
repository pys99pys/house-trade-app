import { FC } from "react";
import { FaTimes } from "react-icons/fa";

import Button from "../common/button/Button";
import styles from "./SavedList.module.css";
import useSavedList from "./useSavedList";

interface SavedListProps {}

const SavedList: FC<SavedListProps> = () => {
  const { list, onClick, onRemove } = useSavedList();

  return (
    <div className={styles.savedList}>
      {list.length === 0 && <div className={styles.empty}>저장 목록 없음</div>}

      {list.map((item) => (
        <div key={item.label}>
          <h6>
            {item.label}({item.items.length})
          </h6>
          <ul>
            {item.items.map((_item, i) => (
              <li key={i}>
                <Button size="small" onClick={() => onClick(item.cityCode, _item)}>
                  {_item.apartName}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.cityCode, _item);
                    }}
                  >
                    <FaTimes />
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SavedList;

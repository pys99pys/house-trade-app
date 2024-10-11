import { FC } from "react";
import { FaTimes } from "react-icons/fa";

import Button from "../common/button/Button";
import styles from "./SavedList.module.css";
import useSavedList from "./useSavedList";

interface SavedListProps {}

const SavedList: FC<SavedListProps> = () => {
  const { list, onClick } = useSavedList();

  return (
    <div className={styles.savedList}>
      {list.map((item) => (
        <div key={item.label}>
          <h6>{item.label}</h6>
          <ul>
            {item.items.map((_item, i) => (
              <li key={i}>
                <Button size="small" onClick={() => onClick(item.cityCode, _item)}>
                  {_item.apartName}
                  <span>
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

import { FC } from "react";

import Button from "../common/button/Button";
import styles from "./Migration.module.css";
import useMigration from "./useMigration";

interface MigrationProps {}

const Migration: FC<MigrationProps> = () => {
  const { value, onChange, onSubmit } = useMigration();

  return (
    <div className={styles.migration}>
      <textarea
        placeholder="JSON 형식의 아파트 목록을 입력해주세요."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button color="primary" onClick={onSubmit}>
        업로드
      </Button>
    </div>
  );
};

export default Migration;

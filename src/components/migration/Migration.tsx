import { FC } from "react";

import Button from "../common/button/Button";
import styles from "./Migration.module.css";
import useMigration from "./useMigration";

interface MigrationProps {}

const Migration: FC<MigrationProps> = () => {
  const { value, onChange, onCopy, onUpload } = useMigration();

  return (
    <div className={styles.migration}>
      <textarea
        placeholder="JSON 형식의 아파트 목록을 입력해주세요."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={styles.buttonWrap}>
        <Button color="yellow" onClick={onCopy}>
          저장 목록 복사
        </Button>
        <Button color="primary" onClick={onUpload}>
          저장 목록 업로드
        </Button>
      </div>
    </div>
  );
};

export default Migration;

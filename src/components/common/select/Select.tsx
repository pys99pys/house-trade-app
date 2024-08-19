import { FC, ReactNode } from "react";

import styles from "./Select.module.css";

interface SelectProps {
  value?: string;
  children: ReactNode;
  onChange?: (value: string) => void;
}

const Select: FC<SelectProps> = ({ value, children, onChange }) => {
  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {children}
    </select>
  );
};

export default Select;

import { FC, ReactNode } from "react";

import styles from "./Select.module.css";

interface SelectProps {
  id?: string;
  value?: string;
  children: ReactNode;
  onChange?: (value: string) => void;
}

const Select: FC<SelectProps> = ({ id, value, children, onChange }) => {
  return (
    <select id={id} className={styles.select} value={value} onChange={(e) => onChange?.(e.target.value)}>
      {children}
    </select>
  );
};

export default Select;

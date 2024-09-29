import cx from "classnames";
import { FC } from "react";

import styles from "./Input.module.css";

interface InputProps {
  id?: string;
  width?: string;
  size?: "default" | "small";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Input: FC<InputProps> = ({ id, width, size = "default", placeholder, value, onChange }) => {
  return (
    <input
      id={id}
      style={{ width }}
      className={cx(styles.input, {
        [styles.default]: size === "default",
        [styles.small]: size === "small",
      })}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};

export default Input;

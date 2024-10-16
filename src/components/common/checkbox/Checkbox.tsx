import classNames from "classnames";
import { FC, ReactNode } from "react";
import { FaCheck } from "react-icons/fa";

import styles from "./Checkbox.module.css";

interface CheckboxProps {
  checked: boolean;
  children: ReactNode;
  onClick?: () => void;
  size?: "default" | "large" | "small" | "xsmall";
}

const Checkbox: FC<CheckboxProps> = ({ checked, children, onClick, size = "default" }) => {
  return (
    <button
      className={classNames(styles.checkbox, {
        [styles.checked]: checked,
        [styles.defaultSize]: size === "default",
        [styles.largeSize]: size === "large",
        [styles.smallSize]: size === "small",
        [styles.xsmallSize]: size === "xsmall",
      })}
      onClick={onClick}
    >
      <FaCheck />
      {children}
    </button>
  );
};

export default Checkbox;

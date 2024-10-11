import { FC } from "react";
import { createPortal } from "react-dom";

import { useToastValue } from "@/stores/toastStore";

import styles from "./ToastPortal.module.css";

interface ToastPortalProps {}

const ToastPortal: FC<ToastPortalProps> = () => {
  const toastState = useToastValue();

  if (!toastState.length) {
    return null;
  }

  return (
    <>
      {createPortal(
        <div className={styles.toastPortal}>
          <ul>{toastState.map((item, i) => (i >= 5 ? null : <li key={item.key}>{item.message}</li>))}</ul>
        </div>,
        document.body
      )}
    </>
  );
};

export default ToastPortal;

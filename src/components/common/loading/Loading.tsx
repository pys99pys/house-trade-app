import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import styles from "./Loading.module.css";

interface LoadingProps {}

const Loading: FC<LoadingProps> = () => {
  const timer = useRef(0);
  const [scene, setScene] = useState<0 | 1 | 2 | 3>(0);

  const setLoadingAction = useCallback(() => {
    setScene(scene === 3 ? 0 : ((scene + 1) as typeof scene));
  }, [scene]);

  useEffect(() => {
    if (timer.current) {
      timer.current = window.setTimeout(setLoadingAction, 200);
    } else {
      timer.current = window.setTimeout(setLoadingAction, 50);
    }

    return () => clearTimeout(timer.current);
  }, [setLoadingAction]);

  return (
    <div className={styles.loading}>
      <span className={classNames({ [styles.active]: scene >= 1 })} />
      <span className={classNames({ [styles.active]: scene >= 2 })} />
      <span className={classNames({ [styles.active]: scene === 3 })} />
    </div>
  );
};

export default Loading;

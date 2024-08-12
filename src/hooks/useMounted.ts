import { useEffect, useRef } from "react";

const useMounted = (): boolean => {
  const isMounted = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    isMounted.current = true;
  }, []);

  return isMounted.current;
};

export default useMounted;

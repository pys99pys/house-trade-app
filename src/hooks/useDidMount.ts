import { useEffect } from "react";

const useDidMount = (func: () => void) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(func, []);
};

export default useDidMount;

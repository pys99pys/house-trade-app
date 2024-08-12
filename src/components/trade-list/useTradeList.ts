import { useEffect, useState } from "react";

interface Params {
  updatedAt: number;
}

interface Return {
  loading: boolean;
  onLoad: () => void;
}

const useTradeList = ({ updatedAt }: Params): Return => {
  const [loading, setLoading] = useState(false);

  const onLoad = () => setLoading(true);

  useEffect(() => setLoading(false), [updatedAt]);

  return { loading, onLoad };
};

export default useTradeList;

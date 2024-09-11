import axios from "axios";

import { TradeItem } from "@/interfaces/TradeItem";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

interface FetchTradeListResponse {
  count: number;
  list: TradeItem[];
}

const useFetchTradeListQuery = (): UseQueryResult<FetchTradeListResponse, unknown> => {
  const { cityCode, yearMonth } = useSearchParamValue();

  return useQuery({
    queryKey: ["fetchTradeList", cityCode, yearMonth],
    staleTime: 86_400,
    gcTime: 86_400,
    enabled: !!cityCode && !!yearMonth,
    queryFn: () => axios.get(`/api/trade-list?cityCode=${cityCode}&yearMonth=${yearMonth}`),
    select: (res) => res.data,
  });
};

export default useFetchTradeListQuery;

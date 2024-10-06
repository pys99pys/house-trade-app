import { useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_ORDER } from "@/constants/storageKeys";
import useSavedList from "@/hooks/useSavedList";
import useTradeList from "@/hooks/useTradeList";
import { OrderType } from "@/interfaces/Order";
import { SavedApartItem, TradeItem } from "@/interfaces/TradeItem";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { useFilterFormValue } from "@/stores/filterFormStore";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { getValue, setValue } from "@/utils/localStorage";
import { compareSavedApartItem, sliceItems, sortItems } from "@/utils/tradeItem";

const PER_PAGE = 15;

interface Return {
  status: "LOADING" | "EMPTY" | "SUCCESS";
  order: OrderType;
  count: number;
  page: number;
  tradeList: TradeItem[];
  savedApartList: SavedApartItem[];

  onChangeOrder: (order: OrderType) => void;
  onClickList: (tradeItem: { address: TradeItem["address"]; apartName: TradeItem["apartName"] }) => void;
  onChangePage: (page: number) => void;
}

const useTradeListTable = (): Return => {
  const searchParam = useSearchParamValue();
  const filterForm = useFilterFormValue();

  const { isLoading } = useFetchTradeListQuery();
  const { savedList, saveItem, removeItem } = useSavedList();
  const { tradeList: filteredTradeList } = useTradeList();

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(getValue(STORAGE_KEY_ORDER) ?? ["tradeDate", "desc"]);

  const savedApartList = useMemo(
    () => savedList.find((item) => item.cityCode === searchParam.cityCode)?.apartList ?? [],
    [searchParam, savedList]
  );

  const tradeList = useMemo(() => {
    const sortedItems = sortItems(filteredTradeList, order);
    const slicedItems = sliceItems(sortedItems, {
      page,
      perPage: PER_PAGE,
    });

    return slicedItems;
  }, [filteredTradeList, order, page]);

  const count = useMemo(() => filteredTradeList.length, [filteredTradeList]);

  const status = useMemo(() => {
    if (isLoading) {
      return "LOADING";
    }

    if (tradeList.length === 0) {
      return "EMPTY";
    }

    return "SUCCESS";
  }, [isLoading, tradeList]);

  const onChangeOrder = (afterOrder: OrderType) => {
    setValue(STORAGE_KEY_ORDER, afterOrder);
    setOrder(afterOrder);
  };

  const onClickList = (tradeItem: { address: TradeItem["address"]; apartName: TradeItem["apartName"] }) => {
    const hasSavedApartList = savedApartList.some((item) => compareSavedApartItem(item, tradeItem));

    if (hasSavedApartList) {
      removeItem(searchParam.cityCode, tradeItem);
    } else {
      saveItem(searchParam.cityCode, tradeItem);
    }
  };

  const onChangePage = (page: number) => {
    setPage(page);
  };

  useEffect(() => setPage(1), [searchParam, filterForm]);

  return { status, order, count, page, tradeList, savedApartList, onChangeOrder, onClickList, onChangePage };
};

export default useTradeListTable;

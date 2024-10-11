import { useEffect, useMemo, useRef, useState } from "react";

import { APART_LIST_STORAGE_KEY, TRADE_LIST_ORDER_STORAGE_KEY } from "@/constants/storageKeys";
import useTradeList from "@/hooks/useTradeList";
import { FilterType } from "@/interfaces/Filter";
import { OrderType } from "@/interfaces/Order";
import { TradeItem } from "@/interfaces/TradeItem";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { useApartListValue, useSetApartListState } from "@/stores/apartListStore";
import { useFilterFormValue, useSetFilterFormState } from "@/stores/filterFormStore";
import { useSearchParamValue } from "@/stores/searchParamStore";
import { createApartItemKey, createApartList, distinctApartList } from "@/utils/apartListUtil";
import { getValue, setValue } from "@/utils/localStorage";
import { sliceItems, sortItems } from "@/utils/tradeItemUtil";

const PER_PAGE = 15;

interface Return {
  status: "LOADING" | "EMPTY" | "SUCCESS";
  order: OrderType;
  count: number;
  page: number;
  tradeList: TradeItem[];
  apartList: string[];

  onChangeOrder: (order: OrderType) => void;
  onSaveItem: (tradeItem: TradeItem) => void;
  onRemoveItem: (tradeItem: TradeItem) => void;
  onChangePage: (page: number) => void;
}

const useTradeListTable = (): Return => {
  const searchParamValue = useSearchParamValue();
  const filterFormValue = useFilterFormValue();
  const apartListValue = useApartListValue();

  const setFilterForm = useSetFilterFormState();
  const setApartList = useSetApartListState();

  const { isLoading } = useFetchTradeListQuery();
  const { tradeList: filteredTradeList } = useTradeList();

  const copiedFilterForm = useRef<FilterType>(filterFormValue);

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(getValue(TRADE_LIST_ORDER_STORAGE_KEY) ?? ["tradeDate", "desc"]);

  const tradeList = useMemo(() => {
    const sortedItems = sortItems(filteredTradeList, order);
    const slicedItems = sliceItems(sortedItems, {
      page,
      perPage: PER_PAGE,
    });

    return slicedItems;
  }, [filteredTradeList, order, page]);

  const apartList = useMemo(
    () => apartListValue.find((item) => item.cityCode === searchParamValue.cityCode)?.items ?? [],
    [searchParamValue.cityCode, apartListValue]
  );

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
    setValue(TRADE_LIST_ORDER_STORAGE_KEY, afterOrder);
    setOrder(afterOrder);
  };

  const onSaveItem = (tradeItem: TradeItem) => {
    const apartItemKey = createApartItemKey({
      address: tradeItem.address,
      apartName: tradeItem.apartName,
    });
    const afterApartItems = distinctApartList([...apartList, apartItemKey]);
    const afterApartList = createApartList(apartListValue, {
      cityCode: searchParamValue.cityCode,
      items: afterApartItems,
    });

    setApartList(afterApartList);
    setValue(APART_LIST_STORAGE_KEY, afterApartList);
  };

  const onRemoveItem = (tradeItem: TradeItem) => {
    const apartItemKey = createApartItemKey({
      address: tradeItem.address,
      apartName: tradeItem.apartName,
    });
    const afterApartItems = apartList.filter((item) => item !== apartItemKey);
    const afterApartList = createApartList(apartListValue, {
      cityCode: searchParamValue.cityCode,
      items: afterApartItems,
    });

    setApartList(afterApartList);
    setValue(APART_LIST_STORAGE_KEY, afterApartList);
  };

  const onChangePage = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    setPage(1);
    setFilterForm({ ...copiedFilterForm.current, apartName: "" });
  }, [searchParamValue, setFilterForm]);

  useEffect(() => {
    setPage(1);
    copiedFilterForm.current = filterFormValue;
  }, [filterFormValue]);

  return {
    status,
    order,
    count,
    page,
    tradeList,
    apartList,

    onChangeOrder,
    onSaveItem,
    onRemoveItem,
    onChangePage,
  };
};

export default useTradeListTable;

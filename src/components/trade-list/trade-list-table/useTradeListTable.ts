import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_APART_LIST, STORAGE_KEY_ORDER } from "@/constants/storageKeys";
import useDidMount from "@/hooks/useDidMount";
import useMounted from "@/hooks/useMounted";
import { FilterType } from "@/interfaces/Filter";
import { OrderType } from "@/interfaces/Order";
import { SearchFormType } from "@/interfaces/SearchForm";
import { TradeItem } from "@/interfaces/TradeItem";
import { parseToAverageAmountText } from "@/utils/formatter";
import { getValue, setValue } from "@/utils/storage";
import {
  createSavedTradeItemValue,
  filterItems,
  sliceItems,
  sortItems,
} from "@/utils/tradeItem";

interface Params {
  tradeItems: TradeItem[];
}

interface Return {
  cityCode: string;
  order: OrderType;
  filter: FilterType;
  page: number;
  averageAmount: number;
  count: number;
  list: TradeItem[];
  savedList: string[];

  onChangeOrder: (column: OrderType[0]) => void;
  onChangePage: (page: number) => void;
  onClickList: (item: TradeItem) => void;
  onChangeApartName: (apartName: string) => void;
  onToggleOnlyBaseSize: () => void;
  onToggleOnlySavedList: () => void;
}

const PER_PAGE = 15;

const useTradeListTable = ({ tradeItems }: Params): Return => {
  const params = useSearchParams();
  const isMounted = useMounted();
  const cityCode = params.get("cityCode") ?? "";

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(["tradeDate", "desc"]);
  const [savedList, setSavedList] = useState<string[]>([]);
  const [filter, setFilter] = useState<FilterType>({
    apartName: "",
    onlyBaseSize: false,
    onlySavedList: false,
  });

  const filteredItems = useMemo(
    () =>
      filterItems(tradeItems, {
        cityCode,
        savedList,
        filter,
      }),
    [tradeItems, cityCode, savedList, filter]
  );

  const list = useMemo(() => {
    const sortedItems = sortItems(filteredItems, order);

    return sliceItems(sortedItems, {
      page,
      perPage: PER_PAGE,
    });
  }, [filteredItems, order, page]);

  const averageAmount = useMemo(() => parseToAverageAmountText(list), [list]);
  const count = useMemo(() => filteredItems.length, [filteredItems]);

  const setDefaultOrder = () => {
    const storageData = getValue<OrderType>(STORAGE_KEY_ORDER);

    if (storageData) {
      setOrder(storageData);
    }
  };

  const setDefaultSavedList = () => {
    const storageData = getValue<string[]>(STORAGE_KEY_APART_LIST);

    if (storageData) {
      setSavedList(storageData);
    }
  };

  const onChangeOrder = (column: OrderType[0]) =>
    setOrder([
      column,
      order[0] === column ? (order[1] === "asc" ? "desc" : "asc") : "asc",
    ]);

  const onClickList = (item: TradeItem) => {
    const target = createSavedTradeItemValue({ cityCode, ...item });
    const isSavedItem = savedList.some((savedItem) => savedItem === target);

    if (isSavedItem) {
      setSavedList(savedList.filter((savedItem) => savedItem !== target));
    } else {
      setSavedList([...savedList, target]);
    }
  };

  const onChangePage = (page: number) => setPage(page);

  const onChangeApartName = (apartName: string) => setFilter({ ...filter, apartName });

  const onToggleOnlyBaseSize = () =>
    setFilter({
      ...filter,
      onlyBaseSize: !filter.onlyBaseSize,
    });

  const onToggleOnlySavedList = () =>
    setFilter({
      ...filter,
      onlySavedList: !filter.onlySavedList,
    });

  useDidMount(() => {
    setDefaultOrder();
    setDefaultSavedList();
  });

  useEffect(
    () => setFilter({ apartName: "", onlyBaseSize: false, onlySavedList: false }),
    [tradeItems]
  );

  useEffect(() => {
    if (isMounted) {
      setPage(1);
    }
  }, [filteredItems, isMounted]);

  useEffect(() => {
    if (isMounted) {
      setValue(STORAGE_KEY_ORDER, order);
    }
  }, [order, isMounted]);

  useEffect(() => {
    if (isMounted) {
      setValue(STORAGE_KEY_APART_LIST, savedList);
    }
  }, [savedList, isMounted]);

  return {
    cityCode,
    order,
    filter,
    page,
    averageAmount,
    count,
    list,
    savedList,
    onChangeOrder,
    onChangePage,
    onClickList,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useTradeListTable;

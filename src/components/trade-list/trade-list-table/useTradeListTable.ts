import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_ORDER, STORAGE_KEY_SAVED_APART_LIST } from "@/constants/storageKeys";
import useSavedList from "@/hooks/useSavedList";
import { FilterType } from "@/interfaces/Filter";
import { OrderType } from "@/interfaces/Order";
import { SavedApartItem, TradeItem } from "@/interfaces/TradeItem";
import { parseToAverageAmountText } from "@/utils/formatter";
import { debounce } from "@/utils/helper";
import { getValue, setValue } from "@/utils/storage";
import {
  compareSavedApartItem,
  filterItems,
  sliceItems,
  sortItems,
} from "@/utils/tradeItem";

interface Params {
  tradeItems: TradeItem[];
}

interface Return {
  order: OrderType;
  filter: FilterType;
  page: number;
  averageAmount: number;
  count: number;
  list: TradeItem[];
  savedApartList: SavedApartItem[];

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
  const cityCodeParam = params.get("cityCode") ?? "";

  const { savedList, saveItem, removeItem } = useSavedList();

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(
    getValue(STORAGE_KEY_ORDER) ?? ["tradeDate", "desc"]
  );
  const [filter, setFilter] = useState<FilterType>({
    apartName: "",
    onlyBaseSize: false,
    onlySavedList: false,
  });

  const savedApartList = useMemo(
    () => savedList.find((item) => item.cityCode === cityCodeParam)?.apartList ?? [],
    [cityCodeParam, savedList]
  );

  const filteredItems = useMemo(
    () =>
      filterItems(tradeItems, {
        savedApartList,
        filter,
      }),
    [tradeItems, savedApartList, filter]
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

  const onChangeOrder = (column: OrderType[0]) =>
    setOrder([
      column,
      order[0] === column ? (order[1] === "asc" ? "desc" : "asc") : "asc",
    ]);

  const onClickList = (tradeItem: {
    address: TradeItem["address"];
    apartName: TradeItem["apartName"];
  }) => {
    const hasSavedApartList = savedApartList.some((item) =>
      compareSavedApartItem(item, tradeItem)
    );

    if (hasSavedApartList) {
      removeItem(cityCodeParam, tradeItem);
    } else {
      saveItem(cityCodeParam, tradeItem);
    }
  };

  const onChangePage = (page: number) => setPage(page);

  const onChangeApartName = debounce((apartName: string) =>
    setFilter({ ...filter, apartName })
  );

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

  useEffect(
    () => setFilter({ apartName: "", onlyBaseSize: false, onlySavedList: false }),
    [tradeItems]
  );
  useEffect(() => setPage(1), [filteredItems]);
  useEffect(() => setValue(STORAGE_KEY_ORDER, order), [order]);
  useEffect(() => setValue(STORAGE_KEY_SAVED_APART_LIST, savedList), [savedList]);

  return {
    order,
    filter,
    page,
    averageAmount,
    count,
    list,
    savedApartList,
    onChangeOrder,
    onChangePage,
    onClickList,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  };
};

export default useTradeListTable;

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_ORDER } from "@/constants/storageKeys";
import useSavedList from "@/hooks/useSavedList";
import { FilterType } from "@/interfaces/Filter";
import { OrderType } from "@/interfaces/Order";
import { SavedApartItem, TradeItem } from "@/interfaces/TradeItem";
import useFetchTradeListQuery from "@/queries/useFetchTradeListQuery";
import { parseToAverageAmountText } from "@/utils/formatter";
import { getValue, setValue } from "@/utils/localStorage";
import { compareSavedApartItem, filterItems, sliceItems, sortItems } from "@/utils/tradeItem";

interface Return {
  isLoading: boolean;
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

const useTradeListTable = (): Return => {
  const { isLoading, data } = useFetchTradeListQuery();

  const params = useSearchParams();
  const cityCodeParam = params?.get("cityCode") ?? "";
  const apartNameParam = params?.get("apartName") ?? "";

  const tradeItems = useMemo(() => data?.list ?? [], [data]);

  const { savedList, saveItem, removeItem } = useSavedList();

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(getValue(STORAGE_KEY_ORDER) ?? ["tradeDate", "desc"]);
  const [filter, setFilter] = useState<FilterType>({
    apartName: apartNameParam,
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

  const onChangeOrder = (column: OrderType[0]) => {
    const afterOrder: OrderType = [column, order[0] === column ? (order[1] === "asc" ? "desc" : "asc") : "asc"];

    setValue(STORAGE_KEY_ORDER, afterOrder);
    setOrder(afterOrder);
  };

  const onClickList = (tradeItem: { address: TradeItem["address"]; apartName: TradeItem["apartName"] }) => {
    const hasSavedApartList = savedApartList.some((item) => compareSavedApartItem(item, tradeItem));

    if (hasSavedApartList) {
      removeItem(cityCodeParam, tradeItem);
    } else {
      saveItem(cityCodeParam, tradeItem);
    }
  };

  const onChangePage = (page: number) => setPage(page);

  const onChangeFilter = (afterFilter: Partial<FilterType>) => {
    setFilter({ ...filter, ...afterFilter });
    setPage(1);
  };

  const onChangeApartName = (apartName: string) => onChangeFilter({ apartName });

  const onToggleOnlyBaseSize = () => onChangeFilter({ onlyBaseSize: !filter.onlyBaseSize });

  const onToggleOnlySavedList = () => onChangeFilter({ onlySavedList: !filter.onlySavedList });

  useEffect(() => setPage(1), [data]);

  return {
    isLoading,
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

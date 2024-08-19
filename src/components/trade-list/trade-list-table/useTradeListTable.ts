import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { STORAGE_KEY_ORDER, STORAGE_KEY_SAVED_APART_LIST } from "@/constants/storageKeys";
import { FilterType } from "@/interfaces/Filter";
import { OrderType } from "@/interfaces/Order";
import { SavedItem, TradeItem } from "@/interfaces/TradeItem";
import { parseToAverageAmountText } from "@/utils/formatter";
import { debounce } from "@/utils/helper";
import { getValue, setValue } from "@/utils/storage";
import {
  createSavedItemKey,
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
  const cityCodeParam = params.get("cityCode") ?? "";

  const [page, setPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(
    getValue(STORAGE_KEY_ORDER) ?? ["tradeDate", "desc"]
  );
  const [originSavedList, setOriginSavedList] = useState<SavedItem[]>(
    getValue(STORAGE_KEY_SAVED_APART_LIST) ?? []
  );
  const [filter, setFilter] = useState<FilterType>({
    apartName: "",
    onlyBaseSize: false,
    onlySavedList: false,
  });

  const savedList = useMemo(
    () =>
      originSavedList.find((item) => item.cityCode === cityCodeParam)?.apartList ?? [],
    [cityCodeParam, originSavedList]
  );

  const filteredItems = useMemo(
    () =>
      filterItems(tradeItems, {
        cityCode: cityCodeParam,
        savedList: originSavedList,
        filter,
      }),
    [tradeItems, cityCodeParam, originSavedList, filter]
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

  const onClickList = (tradeItem: TradeItem) => {
    const savedValue = createSavedItemKey(tradeItem);

    const hasSavedList = originSavedList.some((item) => item.cityCode === cityCodeParam);
    const hasSavedApartList = savedList.some((item) => item === savedValue);
    const afterApartList = hasSavedApartList
      ? savedList.filter((item) => item !== savedValue)
      : [...savedList, savedValue];

    setOriginSavedList(
      (hasSavedList
        ? originSavedList.reduce((acc, item) => {
            if (item.cityCode === cityCodeParam) {
              return [...acc, { cityCode: cityCodeParam, apartList: afterApartList }];
            }

            return [...acc, item];
          }, [] as SavedItem[])
        : [...originSavedList, { cityCode: cityCodeParam, apartList: afterApartList }]
      ).filter((item) => item.apartList.length > 0)
    );
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
  useEffect(
    () => setValue(STORAGE_KEY_SAVED_APART_LIST, originSavedList),
    [originSavedList]
  );

  return {
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

import { FilterType } from "@/interfaces/Filter";
import { TradeItem } from "@/interfaces/TradeItem";

import { createApartItemKey } from "./apartListUtil";

export const filterItems = (
  items: TradeItem[],
  {
    apartList,
    filterForm,
  }: {
    apartList: string[];
    filterForm: FilterType;
  }
) =>
  items.filter((item) => {
    const includedApartName = filterForm.apartName ? item.apartName.includes(filterForm.apartName) : true;

    const includedBaseSize = filterForm.onlyBaseSize && item.size ? item.size > 83 && item.size < 85 : true;

    const includedSavedList = filterForm.onlySavedList
      ? apartList.some((apartItem) => apartItem === createApartItemKey(item))
      : true;

    return includedApartName && includedBaseSize && includedSavedList;
  });

export const sortItems = (items: TradeItem[], order: [keyof TradeItem, "asc" | "desc"]): TradeItem[] => {
  return items.sort((a, b) => {
    if ((a[order[0]] ?? "") > (b[order[0]] ?? "")) {
      return order[1] === "asc" ? 1 : -1;
    } else {
      return order[1] === "asc" ? -1 : 1;
    }
  });
};

export const sliceItems = (
  items: TradeItem[],
  {
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }
) => items.slice((page - 1) * perPage, page * perPage);

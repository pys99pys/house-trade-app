import { FilterType } from "@/interfaces/Filter";
import { SavedItem, TradeItem } from "@/interfaces/TradeItem";

export const createSavedItemKey = (item: TradeItem) =>
  `${item.address.replaceAll(" ", "_")}__${item.apartName.replaceAll(" ", "_")}`;

export const filterItems = (
  items: TradeItem[],
  {
    savedList,
    filter,
  }: {
    savedList: string[];
    filter: FilterType;
  }
) =>
  items.filter((item) => {
    const includedApartName = filter.apartName
      ? item.apartName.includes(filter.apartName)
      : true;

    const includedBaseSize =
      filter.onlyBaseSize && item.size ? item.size > 83 && item.size < 85 : true;

    const includedSavedList = filter.onlySavedList
      ? savedList.some((savedItem) => savedItem === createSavedItemKey(item))
      : true;

    return includedApartName && includedBaseSize && includedSavedList;
  });

export const sortItems = (
  items: TradeItem[],
  order: [keyof TradeItem, "asc" | "desc"]
): TradeItem[] => {
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

import { FilterType } from "@/interfaces/Filter";
import { SavedApartItem, TradeItem } from "@/interfaces/TradeItem";

export const compareSavedApartItem = (a: SavedApartItem, b: SavedApartItem) =>
  a.address === b.address && a.apartName === b.apartName;

export const filterItems = (
  items: TradeItem[],
  {
    savedApartList,
    filterForm,
  }: {
    savedApartList: SavedApartItem[];
    filterForm: FilterType;
  }
) =>
  items.filter((item) => {
    const includedApartName = filterForm.apartName ? item.apartName.includes(filterForm.apartName) : true;

    const includedBaseSize = filterForm.onlyBaseSize && item.size ? item.size > 83 && item.size < 85 : true;

    const includedSavedList = filterForm.onlySavedList
      ? savedApartList.some((savedApartItem) => compareSavedApartItem(item, savedApartItem))
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

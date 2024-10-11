import { ApartListItem } from "@/interfaces/ApartList";
import { TradeItem } from "@/interfaces/TradeItem";

export const createApartList = (
  apartList: ApartListItem[],
  apartItem: { cityCode: string; items: string[] }
): ApartListItem[] => {
  return [...apartList.filter((item) => item.cityCode !== apartItem.cityCode), apartItem].filter(
    (item) => item.items.length > 0
  );
};

export const createApartItemKey = (tradeItem: {
  address: TradeItem["address"];
  apartName: TradeItem["apartName"];
}): string => {
  return [tradeItem.address.replaceAll(" ", "_"), tradeItem.apartName.replaceAll(" ", "_")].join("__");
};

export const distinctApartList = (apartList: string[]): string[] => {
  return apartList.reduce((acc: string[], item: string) => (acc.includes(item) ? acc : [...acc, item]), []);
};

export const filterApartListWithCityCode = (cityCode: string, apartList: ApartListItem[]): string[] => {
  return apartList.find((item) => item.cityCode === cityCode)?.items ?? [];
};

import cityCodes from "@/jsons/city-codes.json";

export const getFirstCityName = (): string => cityCodes[0].name;

export const getFirstCityCode = (): string => cityCodes[0].children[0].code;

export const getCityNameItems = (): string[] => cityCodes.map((item) => item.name);

export const getCityCodeItems = (cityName: string): { code: string; name: string }[] =>
  cityCodes.find((item) => item.name === cityName)?.children ?? [];

export const getCityNameWithCode = (cityCode: string): string =>
  cityCodes.find((item) => item.children.some((child) => child.code === cityCode))
    ?.name ?? "";

export const getCityCodeWithCode = (cityCode: string): string =>
  cityCodes
    .reduce(
      (acc, item) => [...acc, ...item.children],
      [] as { code: string; name: string }[]
    )
    .find((item) => item.code === cityCode)?.name ?? "";

export const encodeSearchParam = (params: { cityCode: string; yearMonth: string; apartName: string }): string => {
  return encodeURIComponent([params.cityCode, params.yearMonth, params.apartName].join(","));
};

export const decodeSearchParam = (
  params: string
): { cityCode: string; yearMonth: string; apartName: string } | undefined => {
  try {
    const [cityCode, yearMonth, apartName] = decodeURIComponent(params).split(",");

    return { cityCode, yearMonth, apartName };
  } catch {
    return undefined;
  }
};

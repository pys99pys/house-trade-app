import cheerio, { Cheerio } from "cheerio";
import type { NextApiRequest, NextApiResponse } from "next";

import { TradeItem } from "@/interfaces/TradeItem";

const calculateIsTradeListTable = (table: Cheerio<any>): boolean => !!table.find(`td:contains("단지명")`).text();

const splitCellText = (text: string): string[] => text.replace(/^\s+|\s+$/gm, "").split("\n");

const formatToNumber = (str: string | undefined): number => (str ? Number(str.replace(/[^0-9]/g, "")) : 0);

const formatToAmount = (amountText: string): number => {
  let amount: number = 0;
  let restText: string = amountText;

  if (amountText.includes("억")) {
    amount += Number(amountText.split("억")[0]) * 100_000_000;
    restText = amountText.split("억")[1];
  }

  if (amountText.includes("천")) {
    amount += Number(restText.split("천")[0]) * 10_000_000;
    restText = restText.split("천")[1];
  }

  if (restText) {
    amount += Number(restText) * 10_000;
  }

  return amount;
};

const parseFirstCellData = (
  cell: Cheerio<any>
): {
  apartName: string;
  buildedYear: number | null;
  householdsNumber: number | null;
  address: string;
} => {
  const texts = splitCellText(cell.text());

  const buildedYearText = texts.find((text) => text.includes("년"));
  const householdsNumberText = texts.find((text) => text.includes("세대"));
  const addressText = texts.find((text, i) => i > 0 && text.includes("동"));

  return {
    apartName: texts[0],
    buildedYear: buildedYearText ? formatToNumber(buildedYearText.split(" ")[0]) : null,
    householdsNumber: householdsNumberText ? formatToNumber(householdsNumberText.split(" / ")[0]) : null,
    address: addressText ?? "",
  };
};

const parseSecondCellData = (
  cell: Cheerio<any>
): {
  tradeDate: string;
  size: number | null;
  floor: number | null;
} => {
  const texts = splitCellText(cell.text());

  const sizeText = texts.find((text) => text.includes("㎡"));
  const floorText = texts.find((text) => text.includes("층"));

  return {
    tradeDate: "20" + texts[0].split(" ")[0].replaceAll(".", "-"),
    size: sizeText ? Number(sizeText.split("㎡")[0]) : null,
    floor: floorText ? formatToNumber(floorText.replaceAll("층", "")) : null,
  };
};

const parseThirdCellData = (
  cell: Cheerio<any>
): {
  isNewRecord: boolean;
  tradeAmount: number;
  maxTradeAmount: number;
} => {
  const texts = splitCellText(cell.text());

  const isNewRecord = texts.some((text) => text.includes("(신)"));
  const tradeAmountText = texts[0];
  const maxTradeAmountText = texts.length === 4 ? texts[2] : texts[1];

  return {
    isNewRecord,
    tradeAmount: formatToAmount(tradeAmountText.split(" (신)")[0]),
    maxTradeAmount: formatToAmount(maxTradeAmountText.split(" ")[0]),
  };
};

const parseRowData = (row: Cheerio<any>): TradeItem => {
  const firstCellItems = parseFirstCellData(row.find("td:nth-child(1)"));
  const secondCellitems = parseSecondCellData(row.find("td:nth-child(2)"));
  const thirdCellitems = parseThirdCellData(row.find("td:nth-child(3)"));

  return {
    ...firstCellItems,
    ...secondCellitems,
    ...thirdCellitems,
  };
};

const parseTradeListData = (html: string): TradeItem[] => {
  const $ = cheerio.load(html);
  const tables = $("table");

  const list: TradeItem[] = [];

  tables.each((_, table) => {
    const isTradeListTable = calculateIsTradeListTable($(table));

    if (!isTradeListTable) {
      return;
    }

    $(table)
      .find("tr:not(:first-child)")
      .each((_, row) => {
        list.push(parseRowData($(row)));
      });
  });

  return list;
};

const fetchTradeList = async ({
  area,
  createDt,
  page,
}: {
  area: string;
  createDt: string;
  page: number;
}): Promise<string> => {
  const response = await fetch(`https://apt2.me/apt/AptMonth.jsp?area=${area}&createDt=${createDt}&pages=${page}`);

  return await response.text();
};

async function* createTradeListPerPage({
  area,
  createDt,
  page,
}: {
  area: string;
  createDt: string;
  page: number;
}): AsyncGenerator<TradeItem[], void, unknown> {
  const html = await fetchTradeList({ area, createDt, page });
  const parsedList = parseTradeListData(html);

  if (parsedList.length > 0) {
    yield parsedList;
    yield* createTradeListPerPage({ area, createDt, page: page + 1 });
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ count: number; list: TradeItem[] } | { message: string }>
) => {
  if (typeof req.query.cityCode !== "string" || typeof req.query.yearMonth !== "string") {
    return res.status(500).json({ message: "필수 파라미터가 누락되었습니다." });
  }

  let count: number = 0;
  let list: TradeItem[] = [];

  for await (const result of createTradeListPerPage({
    area: req.query.cityCode,
    createDt: req.query.yearMonth,
    page: 1,
  })) {
    count += result.length;
    list = list.concat(result);
  }

  res.status(200).json({ count, list });
};

export default handler;

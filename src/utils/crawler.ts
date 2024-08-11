import { TradeItem } from "@/interfaces/TradeItem";
import cheerio, { Cheerio } from "cheerio";

const calcIsTradeListTable = (table: Cheerio<any>): boolean =>
  !!table.find(`td:contains("단지명")`).text();

const splitCellText = (text: string): string[] =>
  text.replace(/^\s+|\s+$/gm, "").split("\n");

const parseNumber = (str: string): number => Number(str.replace(/[^0-9]/g, ""));

const parseAmount = (amountText: string): number => {
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

const parseFirstCell = (
  cell: Cheerio<any>
): {
  apartName: string;
  buildedYear: number;
  householdsNumber: number;
  address: string;
} => {
  const text = splitCellText(cell.text());
  const apartName = text[0];
  const buildedYear = parseNumber(text[1].split(" ")[0]);
  const householdsNumber = parseNumber(text[2].split(" / ")[0]);
  const address = text[3];

  return {
    apartName,
    buildedYear,
    householdsNumber,
    address,
  };
};

const parseSecondCell = (
  cell: Cheerio<any>
): {
  tradeDate: string;
  size: number;
  floor: number;
} => {
  const text = splitCellText(cell.text());
  const tradeDate = "20" + text[0].split(" ")[0].replaceAll(".", "-");
  const floor = parseNumber(text[0].split(" ")[1]);
  const size = Number(text[1].replace("㎡", ""));

  return {
    tradeDate,
    size,
    floor,
  };
};

const parseThirdCell = (
  cell: Cheerio<any>
): {
  isNewRecord: boolean;
  tradeAmount: number;
  maxTradeAmount: number;
} => {
  const text = splitCellText(cell.text());
  const isNewRecord = text[0].includes("신");
  const tradeAmount = parseAmount(text[0].split(" (신)")[0]);
  const maxTradeAmount = parseAmount(
    text[1].includes("↑") ? text[2].split(" ")[0] : text[1].split(" ")[0]
  );

  return {
    isNewRecord,
    tradeAmount,
    maxTradeAmount,
  };
};

const parseRow = (row: Cheerio<any>): TradeItem => {
  const firstCellItems = parseFirstCell(row.find("td:nth-child(1)"));
  const secondCellitems = parseSecondCell(row.find("td:nth-child(2)"));
  const thirdCellitems = parseThirdCell(row.find("td:nth-child(3)"));

  return {
    ...firstCellItems,
    ...secondCellitems,
    ...thirdCellitems,
  };
};

const parseTradeList = (html: string): TradeItem[] => {
  const $ = cheerio.load(html);
  const tables = $("table");

  const list: TradeItem[] = [];

  tables.each((_, table) => {
    const isTradeListTable = calcIsTradeListTable($(table));

    if (!isTradeListTable) {
      return;
    }

    $(table)
      .find("tr:not(:first-child)")
      .each((_, row) => {
        list.push(parseRow($(row)));
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
  const response = await fetch(
    `https://apt2.me/apt/AptMonth.jsp?area=${area}&createDt=${createDt}&pages=${page}`
  );

  return await response.text();
};

async function* getTradeListPerPage({
  area,
  createDt,
  page,
}: {
  area: string;
  createDt: string;
  page: number;
}): AsyncGenerator<TradeItem[], void, unknown> {
  const html = await fetchTradeList({
    area,
    createDt,
    page,
  });

  const parsedList = parseTradeList(html);

  if (parsedList.length > 0) {
    yield parsedList;
    yield* getTradeListPerPage({ area, createDt, page: page + 1 });
  }
}

export const getTradeList = async ({
  area,
  createDt,
}: {
  area: string;
  createDt: string;
}): Promise<{ count: number; list: TradeItem[] }> => {
  let count: number = 0;
  let list: TradeItem[] = [];

  for await (const result of getTradeListPerPage({ area, createDt, page: 1 })) {
    count += result.length;
    list = list.concat(result);
  }

  return { count, list };
};

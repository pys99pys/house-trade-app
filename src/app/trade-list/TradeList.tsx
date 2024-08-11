"use client";

import { useRouter } from "next/navigation";
import { FC } from "react";

import { TradeItem } from "@/interfaces/TradeItem";

interface TradeListProps {
  count: number;
  tradeItems: TradeItem[];
}

const TradeList: FC<TradeListProps> = ({ count, tradeItems }) => {
  const a = useRouter();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          a.push("/trade-list?yearMonth=202407&cityCode=11740");
        }}
      >
        <select>
          <option value="202407">202407</option>
          <option value="202408">202408</option>
        </select>
        <input value="11740" />
        <button>submit</button>
      </form>
      <div>{JSON.stringify(tradeItems)}</div>
    </div>
  );
};

export default TradeList;

import { TradeItem } from "@/interfaces/TradeItem";

export type OrderType = [keyof TradeItem, "asc" | "desc"];

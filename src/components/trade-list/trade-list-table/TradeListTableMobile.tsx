import { FC } from "react";

import Pagination from "@/components/common/pagination/Pagination";
import Select from "@/components/common/select/Select";
import { TRADE_TABLE_PER_PAGE } from "@/constants/rules";
import { OrderType } from "@/interfaces/Order";
import { parseToAmount, parseToFlatSize } from "@/utils/formatter";

import styles from "./TradeListTableMobile.module.css";
import useTradeListTable from "./useTradeListTable";

interface TradeListTableMobileProps {}

const ORDER_OPTIONS: { value: OrderType[0]; label: string }[] = [
  {
    value: "tradeDate",
    label: "거래일",
  },
  {
    value: "address",
    label: "주소지",
  },
  {
    value: "apartName",
    label: "아파트명",
  },
  {
    value: "size",
    label: "평수",
  },
  {
    value: "tradeAmount",
    label: "거래가격",
  },
  {
    value: "maxTradeAmount",
    label: "신고가",
  },
];

const TradeListTableMobile: FC<TradeListTableMobileProps> = () => {
  const { status, order, count, page, tradeList, savedApartList, onChangeOrder, onClickList, onChangePage } =
    useTradeListTable();

  return (
    <div className={styles.TradeListTableMobile}>
      <div className={styles.selectWrap}>
        <Select value={order[0]} onChange={(value) => onChangeOrder([value as OrderType[0], order[1]])}>
          {ORDER_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
        <Select value={order[1]} onChange={(value) => onChangeOrder([order[0], value as OrderType[1]])}>
          <option value="asc">오름순</option>
          <option value="desc">내림순</option>
        </Select>
      </div>
      <div className={styles.tableWrap}>
        {status === "LOADING" && <div className={styles.loading}>조회중</div>}
        {status === "EMPTY" && <div className={styles.loading}>데이터 없음</div>}
        {status === "SUCCESS" && (
          <div className={styles.list}>
            <ul>
              {tradeList.map((item, i) => (
                <li key={i}>
                  <div className={styles.left}>
                    <p className={styles.apartName}>
                      {item.apartName}
                      {item.size && <>({parseToFlatSize(item.size)}평)</>}
                    </p>
                    <p className={styles.address}>{item.address}</p>
                    <p className={styles.etc}>
                      {(() => {
                        const subTexts: string[] = [];

                        if (item.floor !== null) subTexts.push(`${item.floor}층`);
                        if (item.buildedYear !== null) subTexts.push(`${item.buildedYear}년식`);
                        if (item.householdsNumber !== null) subTexts.push(`${item.householdsNumber}세대`);

                        return subTexts.length > 0 ? subTexts.join("/") : "";
                      })()}
                    </p>
                    <p className={styles.tradeDate}>{item.tradeDate}</p>
                  </div>
                  <div className={styles.right}>
                    <p className={styles.tradeAmount}>
                      {parseToAmount(item.tradeAmount)}억원{item.isNewRecord && "(신)"}
                    </p>
                    {item.maxTradeAmount > 0 && <p>{parseToAmount(item.maxTradeAmount)}억원</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {TRADE_TABLE_PER_PAGE > 0 && (
          <div className={styles.pagenationWrap}>
            <Pagination
              size="small"
              per={TRADE_TABLE_PER_PAGE}
              block={5}
              total={count}
              current={page}
              onChange={onChangePage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeListTableMobile;

import cx from "classnames";
import { FC, ReactNode } from "react";

import Button from "@/components/element/button/Button";
import Input from "@/components/element/input/Input";
import Pagination from "@/components/element/pagination/Pagination";
import { TradeItem } from "@/interfaces/TradeItem";
import {
  parseToAmount,
  parseToAmountText,
  parseToAreaSize,
  parseToFlatSize,
  parseToNumberFormat,
} from "@/utils/formatter";
import { createSavedTradeItemValue } from "@/utils/tradeItem";

import styles from "./TradeListTable.module.css";
import useTradeListTable from "./useTradeListTable";

interface TradeListTableProps {
  tradeItems: TradeItem[];
}

const PER_PAGE = 15;

const TradeListTable: FC<TradeListTableProps> = ({ tradeItems }) => {
  const {
    cityCode,
    order,
    filter,
    page,
    averageAmount,
    count,
    list,
    savedList,
    onChangeOrder,
    onChangePage,
    onClickList,
    onChangeApartName,
    onToggleOnlyBaseSize,
    onToggleOnlySavedList,
  } = useTradeListTable({ tradeItems });

  const createHeaderCell = (key: keyof TradeItem, label: string) => (
    <div className={styles.headerCell}>
      <button className={styles.headerButton} onClick={() => onChangeOrder(key)}>
        {label}
        {order[0] === key && <span className={styles[order[1]]}>▾</span>}
      </button>
    </div>
  );

  const createBodyCell = (label: ReactNode) => (
    <div className={styles.rowCell}>{label}</div>
  );

  return (
    <>
      <div className={styles.filterForm}>
        <div className={styles.summary}>
          검색결과: <strong>{count}건</strong>
          {averageAmount > 0 && (
            <>
              {" "}
              / 평단가: <strong>{parseToAmountText(averageAmount)}</strong>
            </>
          )}
        </div>

        <div className={styles.buttonList}>
          <Input size="small" placeholder="아파트명" onChange={onChangeApartName} />
          <Button
            size="small"
            color={filter.onlyBaseSize ? "primary" : "default"}
            onClick={onToggleOnlyBaseSize}
          >
            국민평수
          </Button>
          <Button
            size="small"
            color={filter.onlySavedList ? "primary" : "default"}
            onClick={onToggleOnlySavedList}
          >
            저장 목록
          </Button>
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          {createHeaderCell("tradeDate", "거래일")}
          {createHeaderCell("address", "주소지")}
          {createHeaderCell("apartName", "아파트명")}
          {createHeaderCell("size", "평수")}
          {createHeaderCell("tradeAmount", "거래가격")}
          {createHeaderCell("maxTradeAmount", "신고가")}
        </div>

        <div className={styles.body}>
          {list.length === 0 && <div className={styles.empty}>데이터 없음</div>}

          {list.map((item, i) => (
            <div
              key={i}
              className={cx(styles.row, {
                [styles.active]: savedList.some(
                  (savedItem) =>
                    savedItem === createSavedTradeItemValue({ cityCode, ...item })
                ),
              })}
              onClick={() => onClickList(item)}
            >
              {createBodyCell(<>{item.tradeDate}</>)}
              {createBodyCell(<>{item.address}</>)}
              {createBodyCell(
                <>
                  {item.apartName}
                  <small>
                    ({item.floor}층/
                    {item.buildedYear}년식/
                    {parseToNumberFormat(item.householdsNumber)}세대)
                  </small>
                </>
              )}
              {createBodyCell(
                <>
                  {parseToFlatSize(item.size)}평
                  <small>({parseToAreaSize(item.size)})㎡</small>
                </>
              )}
              {createBodyCell(
                <span className={cx({ [styles.newRecord]: item.isNewRecord })}>
                  {parseToAmount(item.tradeAmount)}억원{item.isNewRecord && "(신)"}
                </span>
              )}
              {createBodyCell(<>{parseToAmount(item.maxTradeAmount)}억원</>)}
            </div>
          ))}
        </div>

        {count > PER_PAGE && (
          <div className={styles.pagination}>
            <Pagination
              per={PER_PAGE}
              total={count}
              current={page}
              onChange={onChangePage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TradeListTable;

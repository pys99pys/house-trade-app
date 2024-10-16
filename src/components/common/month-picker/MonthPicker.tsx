import classNames from "classnames";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";

import styles from "./MonthPicker.module.css";

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const calculateYearValue = (yearValue: string, acc: number): string => {
  return (Number(yearValue) + acc).toString();
};

const calculateMonthValue = (monthValue: string | number, acc: number = 0): string => {
  const calculatedMonthValue = Number(monthValue) + acc;
  const afterMonthValue = calculatedMonthValue === 0 ? 12 : calculatedMonthValue === 13 ? 1 : calculatedMonthValue;

  return afterMonthValue.toString().padStart(2, "0");
};

const MonthPicker: FC<MonthPickerProps> = ({ value, onChange }) => {
  const [isShow, setIsShow] = useState(false);

  const yearValue = useMemo(() => value.substring(0, 4), [value]);
  const monthValue = useMemo(() => value.substring(4, 6), [value]);

  const pickerCloseEvent = useCallback((e: MouseEvent) => {
    const isInPicker = !!(e.target as HTMLElement).closest(`.${styles.monthPicker}`);

    if (!isInPicker) {
      setIsShow(false);
    }
  }, []);

  const onClickPicker = () => {
    setIsShow(true);
  };

  const onClickPrevMonth = () => {
    setIsShow(false);
    onChange(
      (monthValue === "01" ? calculateYearValue(yearValue, -1) : yearValue) + calculateMonthValue(monthValue, -1)
    );
  };

  const onClickNextMonth = () => {
    setIsShow(false);
    onChange(
      (monthValue === "12" ? calculateYearValue(yearValue, +1) : yearValue) + calculateMonthValue(monthValue, +1)
    );
  };

  const onClickPrevYear = () => {
    onChange(calculateYearValue(yearValue, -1) + monthValue);
  };

  const onClickNextYear = () => {
    onChange(calculateYearValue(yearValue, 1) + monthValue);
  };

  const onChangeMonth = (month: number) => {
    setIsShow(false);
    onChange(yearValue + calculateMonthValue(month));
  };

  useEffect(() => {
    if (isShow) {
      document.body.addEventListener("click", pickerCloseEvent);
    }
  }, [isShow, pickerCloseEvent]);

  return (
    <div
      className={classNames(styles.monthPicker, {
        [styles.active]: isShow,
      })}
    >
      <div className={styles.inputWrap}>
        <div className={styles.buttonWrap}>
          <button type="button" onClick={onClickPrevMonth}>
            <FaAngleLeft />
          </button>
        </div>
        <div className={styles.textWrap}>
          {yearValue}년 {Number(monthValue)}월
        </div>
        <div className={styles.buttonWrap}>
          <button type="button" onClick={onClickNextMonth}>
            <FaAngleRight />
          </button>
        </div>
        <div className={styles.buttonWrap}>
          <button type="button" onClick={onClickPicker}>
            <FaCalendarAlt />
          </button>
        </div>
      </div>

      {isShow && (
        <div className={styles.picker}>
          <div className={styles.yearPickerWrap}>
            <button type="button" onClick={onClickPrevYear}>
              <FaArrowLeft />
            </button>
            <span>{yearValue}년</span>
            <button type="button" onClick={onClickNextYear}>
              <FaArrowRight />
            </button>
          </div>
          <div className={styles.monthPickerWrap}>
            <ul>
              {new Array(12).fill(null).map((_, i) => (
                <li key={i}>
                  <button type="button" onClick={() => onChangeMonth(i + 1)}>
                    {i + 1}월
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthPicker;

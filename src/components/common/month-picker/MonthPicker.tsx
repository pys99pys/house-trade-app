import classNames from "classnames";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";

import styles from "./MonthPicker.module.css";

interface MonthPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const MonthPicker: FC<MonthPickerProps> = ({ value, onChange }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isShow, setIsShow] = useState(false);

  const yearValue = useMemo(() => value.substring(0, 4), [value]);
  const monthValue = useMemo(() => value.substring(4, 6), [value]);

  const pickerCloseEvent = useCallback(() => {
    setTimeout(() => setIsShow(false), 50);
  }, []);

  const onClickPicker = () => {
    setIsShow(true);
  };

  const onClickPrevYear = () => {
    const prevYear = Number(yearValue) - 1;
    onChange(prevYear.toString() + monthValue);
  };

  const onClickNextYear = () => {
    const nextYear = Number(yearValue) + 1;
    onChange(nextYear.toString() + monthValue);
  };

  const onClickMonth = (month: number) => {
    const afterMonth = month.toString().padStart(2, "0");
    onChange(yearValue + afterMonth);
  };

  useEffect(() => {
    if (isShow) {
      document.body.addEventListener("click", pickerCloseEvent);
    } else {
      document.body.removeEventListener("click", pickerCloseEvent);
    }
  }, [isShow, pickerCloseEvent]);

  return (
    <div
      ref={ref}
      className={classNames(styles.monthPicker, {
        [styles.active]: isShow,
      })}
      onClick={onClickPicker}
    >
      <div>
        {yearValue}년 {Number(monthValue)}월
      </div>
      <div className={styles.icon}>
        <FaCalendarAlt />
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
                  <button type="button" onClick={() => onClickMonth(i + 1)}>
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

import { FC } from "react";
import { FaBeer, FaTimes } from "react-icons/fa";
import { TiTimes } from "react-icons/ti";

import Button from "@/components/element/button/Button";
import Input from "@/components/element/input/Input";
import Select from "@/components/element/select/Select";
import { getCityCodeItems, getCityNameItems } from "@/utils/cityData";

import styles from "./SearchForm.module.css";
import useSearchForm from "./useSearchForm";

interface SearchFormProps {}

const SearchForm: FC<SearchFormProps> = () => {
  const {
    form,
    registered,
    favoriteList,
    onChangeCityName,
    onChangeCityCode,
    onChangeYearMonth,
    onRegistFavorite,
    onRemoveFavorite,
    onClickFavorite,
    onClickSearch,
  } = useSearchForm();

  return (
    <>
      <form className={styles.form} onSubmit={onClickSearch}>
        <Select value={form.cityName} onChange={onChangeCityName}>
          {getCityNameItems().map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </Select>
        <Select value={form.cityCode} onChange={onChangeCityCode}>
          {getCityCodeItems(form.cityName).map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </Select>
        <Input value={form.yearMonth} onChange={onChangeYearMonth} />
        <Button type="submit" color="primary">
          검색
        </Button>
        {!registered && (
          <Button color="yellow" onClick={onRegistFavorite}>
            즐겨찾기
          </Button>
        )}
      </form>
      <ul className={styles.favoriteItems}>
        {favoriteList.map((item) => (
          <Button
            key={item.cityCode}
            size="xsmall"
            onClick={() => onClickFavorite(item.cityCode)}
          >
            {item.label}
            <span
              role="button"
              className={styles.removeIcon}
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(item.cityCode);
              }}
            >
              <FaTimes />
            </span>
          </Button>
        ))}
      </ul>
    </>
  );
};

export default SearchForm;

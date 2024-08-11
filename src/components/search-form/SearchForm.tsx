"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { TRADE_LIST_PATH } from "@/constants/paths";
import { SearchFormType } from "@/interfaces/SearchForm";

interface SearchFormProps {}

const SearchForm: FC<SearchFormProps> = () => {
  const { push } = useRouter();
  const [form, setForm] = useState<SearchFormType>({
    cityName: "",
    cityCode: "",
    yearMonth: "202407",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        push(
          `http://localhost:3000/${TRADE_LIST_PATH}?yearMonth=${form.yearMonth}&cityCode=11740`
        );
      }}
    >
      <input
        value={form.yearMonth}
        onChange={(e) => setForm({ ...form, yearMonth: e.target.value })}
      />
      <input value="11740" />
      <button>submit</button>
    </form>
  );
};

export default SearchForm;

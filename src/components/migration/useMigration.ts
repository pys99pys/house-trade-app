import { useState } from "react";

import { APART_LIST_STORAGE_KEY } from "@/constants/storageKeys";
import { useSetToastState } from "@/stores/toastStore";
import { getValue, setValue } from "@/utils/localStorage";

interface Return {
  value: string;
  onChange: (value: string) => void;
  onCopy: () => void;
  onUpload: () => void;
}

const useMigration = (): Return => {
  const [data, setData] = useState("");
  const setToast = useSetToastState();

  const validateJsonFormat = () => {
    try {
      if (typeof JSON.parse(data) !== "object") {
        throw new Error();
      }

      return true;
    } catch {
      setToast("JSON 형식의 텍스트를 입력해주세요.");

      return false;
    }
  };

  const onChange = (afterValue: string) => {
    setData(afterValue);
  };

  const onCopy = () => {
    const value = getValue(APART_LIST_STORAGE_KEY);

    if (value) {
      navigator.clipboard.writeText(JSON.stringify(value));
      setToast("저장된 아파트 목록이 복사되었습니다.");
    } else {
      setToast("저장된 아파트 목록이 없습니다.");
    }
  };

  const onUpload = () => {
    if (validateJsonFormat()) {
      setValue(APART_LIST_STORAGE_KEY, JSON.parse(data));
      setToast("아파트 목록이 업데이트 되었습니다.");
    }
  };

  return { value: data, onChange, onCopy, onUpload };
};

export default useMigration;

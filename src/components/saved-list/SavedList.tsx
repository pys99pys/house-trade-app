import { FC } from "react";

import useSavedList from "./useSavedList";

interface SavedListProps {}

const SavedList: FC<SavedListProps> = () => {
  useSavedList();

  return <div>구현중</div>;
};

export default SavedList;

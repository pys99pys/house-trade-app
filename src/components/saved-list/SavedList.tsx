import { FC } from "react";

import useSavedList from "./useSavedList";

interface SavedListProps {}

const SavedList: FC<SavedListProps> = () => {
  useSavedList();

  return <div>SavedList</div>;
};

export default SavedList;

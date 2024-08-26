"use client";

import { useEffect, useState } from "react";

import Layout from "@/components/common/layout/Layout";
import SavedList from "@/components/saved-list/SavedList";

const Page = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Layout>
      <SavedList />
    </Layout>
  );
};

export default Page;

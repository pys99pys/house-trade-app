import { FC, lazy, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import Layout from "@/components/common/layout/Layout";
import { SAVED_LIST_PATH, TRADE_LIST_PATH } from "@/constants/paths";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AppProps {}

const TradeList = lazy(() => import("@/components/trade-list/TradeList"));
const SavedList = lazy(() => import("@/components/saved-list/SavedList"));

const App: FC<AppProps> = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <RecoilRoot>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={TRADE_LIST_PATH} element={<TradeList />} />
              <Route path={SAVED_LIST_PATH} element={<SavedList />} />
              {/* <Route path="/" element={<Navigate to={TRADE_LIST_PATH} replace />} /> */}
            </Routes>
          </Layout>
        </BrowserRouter>
      </RecoilRoot>
    </QueryClientProvider>
  );
};

export default App;

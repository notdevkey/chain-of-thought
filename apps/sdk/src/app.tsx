import * as React from "react";
import { createRoot } from "react-dom/client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "../src/assets/style.css";
import EnvironmentTab from "./components/tabs/environment.";
import ProcessTab from "./components/tabs/process";
import RunTab from "./components/tabs/run";

enum MiroItemType {
  shpae = "shape",
}

const queryClient = new QueryClient();

const tabs = ["Environment", "Process", "Run"] as const;

type TabType = (typeof tabs)[number];

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("Environment");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="wrapper">
        <div className="tabs">
          <div className="tabs-header-list">
            {tabs.map((tab, i) => (
              <div
                tabIndex={1}
                onClick={() => setSelectedTab(tab)}
                key={i}
                className={`tab ${selectedTab === tab ? "tab-active" : ""}`}
              >
                <div className="tab-text">{tab}</div>
              </div>
            ))}
          </div>
        </div>
        {selectedTab === "Environment" && (
          <EnvironmentTab buttonClick={() => setSelectedTab("Process")} />
        )}
        {selectedTab === "Process" && <ProcessTab />}
        {selectedTab === "Run" && <RunTab />}
      </div>
    </QueryClientProvider>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

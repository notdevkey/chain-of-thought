import * as React from "react";
import { createRoot } from "react-dom/client";

import { ShapeExperimental, ShapeName } from "@mirohq/websdk-types";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "../src/assets/style.css";
import EnvironmentTab from "./components/tabs/environment.";
import ProcessTab from "./components/tabs/process";
import RunTab from "./components/tabs/run";
import { ProccessTree } from "./parse";
import { getProcessData } from "./models/process";

enum MiroItemType {
  shpae = "shape",
}

const queryClient = new QueryClient();

const tabs = ["Environment", "Process", "Run"] as const;

type TabType = (typeof tabs)[number];

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<TabType>("Environment");


  async function selectionUpdate() {
    const items = await miro.board.experimental.getSelection();

    // console.log(items[0].id);
    // return

    const processShapeNodes = items.filter(
      (x) =>
        x.type === MiroItemType.shpae &&
        (x.shape === ShapeName.FlowChartProcess ||
          x.shape === ShapeName.FlowChartConnector)
    );
   

    // Handling case of only s single selction
    // TODO: Handle case of multi node selection
    const selectedProcessShapeNode = processShapeNodes[0] as ShapeExperimental;


    if (!selectedProcessShapeNode.parentId){
      const parser =   new ProccessTree();
      const exploer = await parser
      .traverseFlowchart(selectedProcessShapeNode.id);

      console.log('parser, ', exploer)

      const mapped = parser.countNodesAtEachLevel(exploer)

      console.log('test: ', mapped);
      
      const resutl = await getProcessData(mapped)
      console.log('resutl: ', resutl);
    }
  }





  React.useEffect(() => {
    miro.board.ui.on("selection:update", selectionUpdate);
  }, []);

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

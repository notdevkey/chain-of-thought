import * as React from "react";
import { createRoot } from "react-dom/client";

import { ShapeExperimental, ShapeName } from "@mirohq/websdk-types";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import "../src/assets/style.css";
import EnvironmentTab from "./components/tabs/environment.";
import ProcessTab from "./components/tabs/process";
import RunTab from "./components/tabs/run";
import { Process, ProcessNode, ProcessProps } from "./models/process";
import { extractTitleFromHTML } from "./utils/domUtil";

enum MiroItemType {
  shpae = "shape",
}

const queryClient = new QueryClient();

const tabs = ["Environment", "Process", "Run"] as const;

type TabType = (typeof tabs)[number];

const App: React.FC = () => {
  const [completeProcess, setCompleteProcess] = useState<Process[]>([]);
  const [visitedConnections, setVisitedConnections] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabType>("Environment");

  const [processNodes, setProcessNodes] = useState<Map<string, ProcessNode>>(
    new Map()
  );

  const [miroNodes, setMiroNodes] = useState<Map<string, ShapeExperimental>>(
    new Map()
  );

  const [selectedProcessNode, setSelectedProcessNode] = useState<ProcessNode>();

  async function selectionUpdate() {
    const items = await miro.board.experimental.getSelection();
    const processShapeNodes = items.filter(
      (x) =>
        x.type === MiroItemType.shpae &&
        (x.shape === ShapeName.FlowChartProcess ||
          x.shape === ShapeName.FlowChartConnector)
    );
    if (!processShapeNodes.length) {
      setSelectedProcessNode(undefined);
      return;
    }

    // Handling case of only s single selction
    // TODO: Handle case of multi node selection
    const selectedProcessShapeNode = processShapeNodes[0] as ShapeExperimental;

    updateMiroNodesRef(selectedProcessShapeNode);

    switch (selectedProcessShapeNode.shape) {
      case ShapeName.FlowChartProcess:
        const processNode = await createProcessStep(selectedProcessShapeNode);
        updateProcessNodemap(processNode);
        break;

      case ShapeName.FlowChartConnector:
        break;

      default:
        break;
    }

    // try to go through the whole process and parse data object
    if (!selectedProcessShapeNode.parentId)
      parseProcessData(selectedProcessShapeNode.id, true);
  }

  async function parseProcessData(startingNodeId: string, init = false) {
    const processState = [...completeProcess];
    const startMiroNode = await getProcessMiroNodeById(startingNodeId);
    if (!startMiroNode) return;

    const processStartNode = await createProcessStep(startMiroNode);
    if (!processStartNode) return;

    if (init) {
      processState.push(processStartNode);
    }

    const connecters = await startMiroNode.getConnectors();
    const nonVisitedConnectors = connecters.filter(
      (connector) => !visitedConnections.includes(connector.id)
    );

    if (nonVisitedConnectors.length >= 1) {
      if (nonVisitedConnectors.length === 1) {
        const nextMirpNodeId = nonVisitedConnectors[0].end?.item;
        if (nextMirpNodeId) {
          const nextProcessNode = await getProcessNodeById(nextMirpNodeId);
          if (nextProcessNode) {
            processState.push(nextProcessNode);

            setVisitedConnections((prev) => [
              ...prev,
              nonVisitedConnectors[0].id,
            ]);
          }
        }
      } else {
        const processesByParent: { [parentId: string]: ProcessNode[] } = {};
        const parallelProcesses: Process = [];

        for (const connecterInx in connecters) {
          const connecter = connecters[connecterInx];
          const nextNodeId = connecter.end?.item;

          if (nextNodeId) {
            const nextProcessNode = await getProcessNodeById(nextNodeId);

            if (nextProcessNode) {
              const parentId = nextProcessNode?.parentNode || "";

              if (parentId) {
                processesByParent[parentId] = [
                  ...(processesByParent[parentId] || []),
                  nextProcessNode,
                ];
              } else {
                parallelProcesses.push(nextProcessNode);
              }
            }
          }

          setVisitedConnections((prev) => [...prev, connecter.id]);
        }

        Object.values(processesByParent).forEach((processGroup) => {
          if (processGroup.length > 0) {
            const processData = {
              ...processGroup[0],
              resource: processGroup.length.toString(),
            };
            parallelProcesses.push(processData);
          }
        });
        processState.push(parallelProcesses);
      }
    }

    setCompleteProcess((state) => [...state, processState]);
    console.log(processState, console.log(visitedConnections));
  }

  async function getProcessNodeById(
    nodeId: string
  ): Promise<ProcessNode | null> {
    const [endNode] = (await miro.board.experimental.get({
      id: nodeId,
    })) as ShapeExperimental[];
    return endNode?.shape === ShapeName.FlowChartProcess
      ? await createProcessStep(endNode)
      : null;
  }

  async function getProcessMiroNodeById(
    nodeId: string
  ): Promise<ShapeExperimental | null> {
    const [node] = (await miro.board.experimental.get({
      id: nodeId,
    })) as ShapeExperimental[];
    return node?.shape === ShapeName.FlowChartProcess ? node : null;
  }

  function updateMiroNodesRef(node: ShapeExperimental) {
    setMiroNodes((map) => {
      map.set(node.id, node);
      return map;
    });
  }

  async function createProcessStep(
    node: ShapeExperimental
  ): Promise<ProcessNode> {
    const nodeId = node.id;

    // get pars node html content into step anem
    const stepName = extractTitleFromHTML(node.content);

    const metadata = await node.getMetadata();

    return {
      nodeId: nodeId,
      name: stepName,
      distribution: metadata.distribution || "",
      cycle_time: metadata.cycle_time || "0",
      min_value: metadata.min_value || "0",
      max_value: metadata.max_value || "0",
      mean_value: metadata.mean_value || "0",
      std_dev: metadata.std_dev || "0",
      changeover: metadata.changeover || "0",
      resource: metadata.resource || "1",
      parentNode: node.parentId,
    };
  }

  function updateProcessNodemap(processNode: ProcessNode) {
    setProcessNodes((nodesMap) => {
      const currentNode = nodesMap.get(processNode.nodeId);
      const updatedNode = {
        ...currentNode,
        ...processNode,
      };

      nodesMap.set(processNode.nodeId, updatedNode);
      setSelectedProcessNode(updatedNode);
      return nodesMap;
    });
  }

  function handleProcessStateChange(
    nodeId: string,
    stateChange: { [key: string]: string }
  ): void {
    setProcessNodes((nodesMap) => {
      const currentNode = nodesMap.get(nodeId);
      if (!currentNode) return nodesMap;

      Object.entries(stateChange).forEach(([key, value]) => {
        const updatedNode = {
          ...currentNode,
          [key]: value,
        };

        nodesMap.set(nodeId, updatedNode);
        setSelectedProcessNode(updatedNode);

        if (ProcessProps.includes(key)) {
          miroNodes.get(nodeId)?.setMetadata(key, value);
        }
      });

      return nodesMap;
    });
  }

  async function insertProcessStartpoint() {}

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
        {/* {!selectedProcessNode && (
        <div className="cs1 ce12">
          <h1>Create Your Process!</h1>
          <p>
            Utilize the Mindmap Feature to Define Your Manufacturing Process
          </p>
          <p>
            Building your manufacturing process is made easy with the Mindmap
            feature. Each node in the mind map represents a crucial process
            step.
          </p>
          <p>
            To set the details for each step, simply select the corresponding
            node on the board. This allows you to define and customize each
            process step with precision.
          </p>
        </div>
      )}

      {!selectedProcessNode && (
        <div className="cs1 ce12">
          <a
            className="button button-primary"
            onClick={insertProcessStartpoint}
          >
            Insert Process start point
          </a>
        </div>
      )}

      {selectedProcessNode && (
        <div className="cs1 ce12">
          <h1 className="h2">Customize Process Step!</h1>
          <p className="p-medium">set the details for the selected step</p>
        </div>
      )}

      {selectedProcessNode && (
        <div className="cs1 ce12">
          <CreateProcessStep
            process={selectedProcessNode}
            onProcessStateChange={handleProcessStateChange}
          />
        </div>
      )} */}
      </div>
    </QueryClientProvider>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

import * as React from "react";
import { createRoot } from "react-dom/client";

import "../src/assets/style.css";
import { ShapeExperimental, ShapeName } from "@mirohq/websdk-types";
import CreateProcessStep from "./components/createProcessStep";
import { useState } from "react";
import {  ProcessNode, ProcessProps, getProcessData } from "./models/process";
import {
  createProcessStep,
} from "./utils/nodeUtil";
import { ProccessTree } from "./parse";

enum MiroItemType {
  shpae = "shape",
}

const App: React.FC = () => {
  const [processNodes, setProcessNodes] = useState<Map<string, ProcessNode>>(
    new Map()
  );

  const [miroNodes, setMiroNodes] = useState<Map<string, ShapeExperimental>>(
    new Map()
  );

  const [selectedProcessNode, setSelectedProcessNode] = useState<ProcessNode>();

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
    if (!processShapeNodes.length) return;

    // Handling case of only s single selction
    // TODO: Handle case of multi node selection
    const selectedProcessShapeNode = processShapeNodes[0] as ShapeExperimental;

    updateMiroNodesRef(selectedProcessShapeNode);

    switch (selectedProcessShapeNode.shape) {
      case ShapeName.FlowChartProcess:
      case ShapeName.FlowChartConnector:
        const processNode = await createProcessStep(selectedProcessShapeNode);
        updateProcessNodemap(processNode);
        break;

      default:
        break;
    }

    // try to go through the whole process and parse data object
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

  function updateMiroNodesRef(node: ShapeExperimental) {
    setMiroNodes((map) => {
      map.set(node.id, node);
      return map;
    });
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
    <div className="grid wrapper">
      {!selectedProcessNode && (
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
      )}
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

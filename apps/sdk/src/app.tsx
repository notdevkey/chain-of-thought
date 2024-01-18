import * as React from "react";
import { createRoot } from "react-dom/client";

import "../src/assets/style.css";
import { MindmapNode } from "@mirohq/websdk-types";
import CreateProcessStep from "./components/createProcessStep";
import { useState } from "react";
import { extractTitleFromHTML } from "./utils/domUtil";
import { ProcessNode, ProcessProps } from "./models/process";

const App: React.FC = () => {
  const [selectedMindmapNode, setselectedMindmapNode] = useState<
    MindmapNode | undefined
  >();
  const [selectedProcessData, setSelectedProcessData] = useState<ProcessNode>({
    nodeId: "",
    props: {
      name:'',
      co: '',
      ct: '',
    },
    nextNodes: [],
    parenNode: "",
  });



  async function selectionUpdate() {
    const items = await miro.board.experimental.getSelection();
    if (!items) return;

    // Handling case of only s single selction
    // TODO: Handle case of multi node selection
    if (items.length > 1) return;

    const node = items[0];

    // Handling only mindmap_node nodes
    if (node.type !== "mindmap_node") return;

    const mindmapNode = node as MindmapNode;

    createMindmapProcess(mindmapNode);

    setselectedMindmapNode(mindmapNode);
  }

  async function createMindmapProcess(node: MindmapNode) {
    const metadata = await node.getMetadata();
    debugger
    
    setSelectedProcessData((process) => {
      const processName = extractTitleFromHTML(node.nodeView.content);
      return {
        ...process,
        nodeId: node.id,
        name: processName,
        ct: metadata.ct || '',
        co: metadata.co || '',
        parenNode: node.parentId,
        nextNodes: node.childrenIds,
      };
    });
  }

  function handleProcessStateChange(key: string, value:string): void{
    setSelectedProcessData(prevProcess => ({
      ...prevProcess,
      [key]: value
    }));


    if(ProcessProps.includes(key)){
      selectedMindmapNode?.setMetadata(key, value);
    }    
    
  } 

  async function insertProcessStartpoint() {}

  React.useEffect(() => {
    miro.board.ui.on("selection:update", selectionUpdate);
  }, []);

  return (
    <div className="grid wrapper">
      {!selectedMindmapNode && (
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

      {!selectedMindmapNode && (
        <div className="cs1 ce12">
          <a
            className="button button-primary"
            onClick={insertProcessStartpoint}
          >
            Insert Process start point
          </a>
        </div>
      )}

      {selectedMindmapNode && (
        <div className="cs1 ce12">
          <h1 className="h2">Customize Process Step!</h1>
          <p className="p-medium">set the details for the selected step</p>
        </div>
      )}

      {selectedMindmapNode && (
        <div className="cs1 ce12">
          <CreateProcessStep
            process={selectedProcessData}
            onProcessStateChange={handleProcessStateChange}
          />
        </div>
      )}
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

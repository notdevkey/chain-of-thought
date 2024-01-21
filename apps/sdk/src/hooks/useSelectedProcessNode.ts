import {
  Frame,
  SelectionUpdateEvent,
  ShapeExperimental,
  ShapeName,
} from "@mirohq/websdk-types";
import { useEffect, useState } from "react";
import { ProcessSchema } from "../components/tabs/process";

enum MiroItemType {
  shape = "shape",
}

export function useSelectedNode() {
  const [node, setNode] = useState<ShapeExperimental | Frame>();
  const [data, setData] = useState<ProcessSchema>();

  async function selectionUpdate(event: SelectionUpdateEvent) {
    const nodes = event.items.filter(
      (x) =>
        x.type === "frame" ||
        (x.type === "shape" &&
          (x.shape === ShapeName.FlowChartProcess ||
            x.shape === ShapeName.FlowChartConnector))
    );
    if (!nodes.length) {
      setNode(undefined);
      return;
    }

    // Handling case of only s single selction
    // TODO: Handle case of multi node selection
    const selectedNode = nodes[0] as ShapeExperimental;
    const data = JSON.parse(await selectedNode.getMetadata("simulation"));

    setNode(selectedNode);
    setData(data);
  }

  useEffect(() => {
    miro.board.ui.on("selection:update", selectionUpdate);
  }, []);

  return { node, data };
}

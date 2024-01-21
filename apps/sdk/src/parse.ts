import { ShapeExperimental } from "@mirohq/websdk-types";
import { Process } from "./models/process";

export type OptimalStructureArray = any


interface NestedItem {
  id: string;
  parentId: string;
  // Other properties
}

export class ProccessTree {
  process: Process[] = [];

  init = false;

  nextNodes: Array<string | Array<NestedItem>> = [];
  previousNodes: string[] = [];

  constructor() {}

  getChildren = async (nodeId: string): Promise<ShapeExperimental[]> => {
    const children: ShapeExperimental[] = [];
    const [node] = (await miro.board.experimental.get({
      id: nodeId,
    })) as Array<ShapeExperimental>;

    const nodeConnectors = await node.getConnectors();
    const connectors = nodeConnectors.filter(
      (item) => item.start?.item === nodeId
    );

    for (const connector of connectors) {
      const childId = connector.end?.item;
      if (childId) {
        const [child] = (await miro.board.experimental.get({
          id: childId,
        })) as Array<ShapeExperimental>;
        if (child) {
          children.push(child);
        }
      }
    }

    return children;
  };

  async traverseFlowchart(startId: string): Promise<any> {

    const [startShape] = (await miro.board.experimental.get({
      id: startId,
    })) as Array<ShapeExperimental>;

    if (!startShape) {
      return null;
    }

    const children = await this.getChildren(startId);

    // Sibling grouping and redundancy handling
    const groupedChildren: Array<any> =
      [];
    const childMap = new Map<string, Array<ShapeExperimental>>(); // Map to group children with identical structures

    for (const child of children) {
      const childStructure = JSON.stringify(child); // Use a string representation for comparison
      const existingGroup = childMap.get(childStructure);

      if (existingGroup) {
        // Add child to existing group
        existingGroup.push(child);
      } else {
        // Create a new group
        groupedChildren.push([child]);
        childMap.set(
          childStructure,
          groupedChildren[groupedChildren.length - 1]
        );
      }
    }

    // Recursively traverse children, passing grouped children
    const childNodes = [];
    for (const childGroup of groupedChildren) {
      const grandChildren = await this.traverseFlowchart(childGroup[0].id); // Traverse only one child per group
      childNodes.push(grandChildren);
    }


    
    return [startShape.id, ...childNodes];
  }  

  


   countNodesAtEachLevel(input: OptimalStructureArray): OptimalStructureArray {
    const result: OptimalStructureArray = [];
  
    function traverse(node: OptimalStructureArray, level: number): void {
      if (!result[level]) {
        result[level] = [];
      }
  
      if (typeof node === 'string') {
        // Check if the node is not already present at the current level
        if (!result[level].includes(node)) {
          result[level].push(node);
        }
      } else if (Array.isArray(node)) {
        node.forEach((child) => traverse(child, level + 1));
      }
    }
  
    traverse(input, 0);
  
    return result;
  }

}

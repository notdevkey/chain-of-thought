import { ShapeExperimental, ShapeName } from "@mirohq/websdk-types";
import { ProcessNode, ProcessNodeType } from "../models/process";

export async function getProcessNodeById(
    nodeId: string
  ): Promise<ProcessNode | null> {
    const [node] = (await miro.board.experimental.get({
      id: nodeId,
    })) as ShapeExperimental[];

    if (ShapeName.FlowChartProcess || ShapeName.FlowChartConnector) {
      return await createProcessStep(node);
    }
    return null;
  }

  export async function getProcessMiroNodeById(
    nodeId: string
  ): Promise<ShapeExperimental | null> {
    const [node] = (await miro.board.experimental.get({
      id: nodeId,
    })) as ShapeExperimental[];

    if (ShapeName.FlowChartProcess || ShapeName.FlowChartConnector) {
      return node;
    }
    return null;
  }

  export async function createProcessStep(
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
      type:
        node.shape === ShapeName.FlowChartConnector
          ? ProcessNodeType.queue
          : ProcessNodeType.process,
      parentNode: node.parentId,
    };
  }

  export function extractTitleFromHTML(htmlString: string): string {
    try {
      const doc = document.createDocumentFragment();
      const tempElement = document.createElement('div');
      tempElement.innerHTML = htmlString;
  
      doc.appendChild(tempElement);
  
      const findTextContent = (node: Node): string  => {
        const childNodes = Array.from(node.childNodes);
  
        if (childNodes.length === 0) {
          return node.textContent?.trim() || '';
        }
  
        // Recursively traverse child nodes
        for (const childNode of childNodes) {
          if (childNode.nodeType === Node.ELEMENT_NODE || childNode.nodeType === Node.TEXT_NODE) {
            const content = findTextContent(childNode as Node);
            if (content) {
              return content;
            }
          }
        }
  
        return '';
      };
  
      return findTextContent(doc);
    } catch (error) {
      console.error('Error parsing HTML:', error);
      return '';
    }
  }
  
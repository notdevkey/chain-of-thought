import { OptimalStructureArray } from "../parse";
import { getProcessMiroNodeById, getProcessNodeById } from "../utils/nodeUtil";

export type ProcessNode = Record<string, any>;

export type Process = ProcessNode | ProcessNode[];

export const ProcessProps = [
  "changeover",
  "cycle_time",
  "distribution",
  "min_value",
  "max_value",
  "mean_value",
  "std_dev",
  "resource",
];

export enum ProcessNodeType {
  process = "process",
  queue = "queue",
}

export async function getProcessData(flowchartTree: OptimalStructureArray): Promise<Process>{
  const process: Process = [];

  for (const level of flowchartTree){
    if(!level.length) continue;

    if(level.length  === 1){
      const processNode = await getProcessNodeById(level[0]);
      process.push(processNode);
    }else{
      // merge element within same frame
      const parrarelProccess: Array<ProcessNode> = [];
      const siblingsNodes = [];
      for (const node of level){

        const miroNode = await getProcessMiroNodeById(node);
        if(miroNode){
          siblingsNodes.push({id: miroNode.id, parentId: miroNode.parentId})
        }
      }
      const groupedSiblingByParent = groupBy(siblingsNodes, 'parentId');

      for( const groupedSibling in groupedSiblingByParent){
          if (groupedSibling==='default'){
            const defatulNodes = groupedSiblingByParent[groupedSibling]
              for (const defaultNode of defatulNodes){
                const processNode = await getProcessNodeById(defaultNode.id);
                if(!processNode) continue;
                parrarelProccess.push(processNode)
              }
          }else{
            const frameNode = groupedSiblingByParent[groupedSibling][0];
            const processNode = await getProcessNodeById(frameNode.id);
            if(!processNode) continue;
            parrarelProccess.push({...processNode, resource: groupedSiblingByParent[groupedSibling].length});
          }
      }

      process.push(parrarelProccess)
    }
  }

  return process

}

 function groupBy(array: any[], key: string) {
  return array.reduce((result, item) => {
    const groupKey = item[key] === undefined || item[key] === '' ? 'default' : item[key];
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(item);
    return result;
  }, {});
}

const sample = {
  name: "Name of Process Step 1",
  distribution:
    "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
  cycle_time: "Cycle time (required if distribution is 'fixed')",
  min_value: "Minimum cycle time (required if distribution is 'uniform')",
  max_value: "Maximum cycle time (required if distribution is 'uniform')",
  mean_value:
    "Mean cycle time (required if distribution is 'exponential' or 'normal')",
  std_dev: "Standard deviation (required if distribution is 'normal')",
  changeover: "Changeover time for the process step",
  resource: "Capacity of the resource for the process step",
};

const sampleProcess = [
  {
    name: "Stamping",
    distribution:
      "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
    cycle_time: "Cycle time (required if distribution is 'fixed')",
    min_value: "Minimum cycle time (required if distribution is 'uniform')",
    max_value: "Maximum cycle time (required if distribution is 'uniform')",
    mean_value:
      "Mean cycle time (required if distribution is 'exponential' or 'normal')",
    std_dev: "Standard deviation (required if distribution is 'normal')",
    changeover: "Changeover time for the process step",
    resource: "1",
  },
  {
    name: "Spot Weld",
    distribution:
      "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
    cycle_time: "Cycle time (required if distribution is 'fixed')",
    min_value: "Minimum cycle time (required if distribution is 'uniform')",
    max_value: "Maximum cycle time (required if distribution is 'uniform')",
    mean_value:
      "Mean cycle time (required if distribution is 'exponential' or 'normal')",
    std_dev: "Standard deviation (required if distribution is 'normal')",
    changeover: "Changeover time for the process step",
    resource: "2",
  },
  [
    {
      name: "Inspection",
      distribution:
        "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
      cycle_time: "Cycle time (required if distribution is 'fixed')",
      min_value: "Minimum cycle time (required if distribution is 'uniform')",
      max_value: "Maximum cycle time (required if distribution is 'uniform')",
      mean_value:
        "Mean cycle time (required if distribution is 'exponential' or 'normal')",
      std_dev: "Standard deviation (required if distribution is 'normal')",
      changeover: "Changeover time for the process step",
      resource: "1",
    },
    {
      name: "Another process",
      distribution:
        "Type of Distribution (e.g., 'uniform', 'exponential', 'normal', 'fixed')",
      cycle_time: "Cycle time (required if distribution is 'fixed')",
      min_value: "Minimum cycle time (required if distribution is 'uniform')",
      max_value: "Maximum cycle time (required if distribution is 'uniform')",
      mean_value:
        "Mean cycle time (required if distribution is 'exponential' or 'normal')",
      std_dev: "Standard deviation (required if distribution is 'normal')",
      changeover: "Changeover time for the process step",
      resource: "1",
    },
  ],
];

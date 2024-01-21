// async parse(): Promise<void> {
//     console.log(...this.process);
//     for (const node of this.nextNodes) {
//       // handle single node
//       if (typeof node === "string") {
//         if (this.previousNodes.includes(node)) {
//           return;
//         }

//         const startMiroNode = await getProcessMiroNodeById(node);
//         if (!startMiroNode) continue;

//         const processStartNode = await createProcessStep(startMiroNode);
//         if (!processStartNode) continue;

//         this.process.push(processStartNode);
//         this.previousNodes.push(node);
//       }
//       // handle parallel and frame nodes
//       else {
//         // get nodes under same parent to be merged into one
//         const mergedNodes = this.mergeItemsWithSameParentId(node);
//         if (mergedNodes.length === 1) {
//           const startMiroNode = await getProcessMiroNodeById(mergedNodes[0].id);
//           if (!startMiroNode) continue;

//           const processStartNode = await createProcessStep(startMiroNode);
//           if (!processStartNode) continue;

//           this.process.push(processStartNode);
//         } else if (mergedNodes.length > 1) {
//           const parallelProcesses = [];
//           for (const nestedNode of mergedNodes) {
//             const startMiroNode = await getProcessMiroNodeById(nestedNode.id);
//             if (!startMiroNode) continue;

//             const processStartNode = await createProcessStep(startMiroNode);
//             if (!processStartNode) continue;

//             parallelProcesses.push(processStartNode);
//           }
//           this.process.push(parallelProcesses);
//         }

//         this.previousNodes = [
//           ...this.previousNodes,
//           ...node.map((x: NestedItem) => x.id),
//         ];
//       }
//     }

//     for (const node in this.currentNodes) {
//       const miroNode = await getProcessMiroNodeById(node);
//       if (!miroNode) continue;

//       const connecters = await miroNode.getConnectors();
//       // exclude nodes that nodes from previous level that points to current node
//       const uinuqeConnecters = connecters.filter((x) => x.end?.item !== node);

//       if (uinuqeConnecters.length === 1) {
//         const nextNodeId = uinuqeConnecters[0].end?.item;
//         if (nextNodeId) {
//           this.nextNodes = [node];
//         }
//       } else if (uinuqeConnecters.length > 1) {
//         const nextNodes: NestedItem[] = [];

//         for (const connecter of uinuqeConnecters) {
//           const nextNodeId = connecter.end?.item;
//           if (nextNodeId) {
//             const nextMiroNode = await getProcessMiroNodeById(nextNodeId);
//             if (nextMiroNode) {
//               nextNodes.push({
//                 id: nextNodeId,
//                 parentId: nextMiroNode.parentId || "",
//               });
//             }
//           }
//         }
//         this.nextNodes = [nextNodes];
//       }

//     }
//     this.parse()
//   }

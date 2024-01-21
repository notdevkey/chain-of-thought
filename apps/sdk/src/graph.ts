// interface Shape {
//     id: string;
//     type: string;
//     parentId: string | null;
//     content: string;
//   }
  
//   interface Connector {
//     id: string;
//     type: string;
//     start: { item: string };
//     end: { item: string };
//   }
  
//   // Sample Miro flowchart data
//   const miroData: (Shape | Connector)[] = [...]; // Your provided data goes here
  
//   // Function to get the children of a shape based on connectors
//   const getChildren = (parentId: string): Shape[] => {
//     const children: Shape[] = [];
//     const connectors = miroData.filter((item) => item.type === 'connector' && item.start.item === parentId);
  
//     for (const connector of connectors) {
//       const childId = connector.end.item;
//       const child = miroData.find((item) => item.id === childId && item.type === 'shape') as Shape;
  
//       if (child) {
//         children.push(child);
//       }
//     }
  
//     return children;
//   };
  
//   // Function to traverse the flowchart and build the desired structure
//   const traverseFlowchart = (startId: string): any => {
//     const startShape = miroData.find((item) => item.id === startId && item.type === 'shape') as Shape;
  
//     if (!startShape) {
//       return null;
//     }
  
//     const children = getChildren(startId);
  
//     // Recursively traverse children
//     const childNodes = children.map((child) => traverseFlowchart(child.id));
  
//     // If the shape is inside a frame, merge into a single object
//     if (startShape.parentId) {
//       return { [startShape.content]: childNodes };
//     }
  
//     // If there are no children, return the shape content
//     if (childNodes.length === 0) {
//       return startShape.content;
//     }
  
//     // Otherwise, group children with the shape content
//     return [startShape.content, ...childNodes];
//   };
  
//   // Example usage
//   const startId = '3458764576275860028';
//   const result = traverseFlowchart(startId);
//   console.log(result);
  
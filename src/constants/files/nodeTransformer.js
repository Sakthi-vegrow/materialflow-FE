import { edgeColors } from "./entities";

export const transformToNodesAndEdges = (data) => {
  let nodes = [];
  let edges = [];

  const traverse = (node, parentId, depth = 0) => {
    let [entity, levelId] = node.node_id.split("-");

    let currentNode = {
      id: node.node_id,
      data: {
        label: node.node_id,
        ...node,
        isSelected: selectedNodes.includes(levelId),
      },
      position: { x: 0, y: 0 },
      depth,
      type: entity || "PurchaseOrder",
      parentNode: "PurchaseOrder",
    };

    if (parentId) {
      edges.push({
        id: `e${parentId}-${node.node_id}`,
        source: parentId,
        target: node.node_id,
        style: {
          stroke: edgeColors[parentId.split("-")[0]],
        },
      });
    }

    nodes.push(currentNode);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => {
        traverse(child, node.node_id, depth + 1);
      });
    }
  };

  traverse(data, null);

  return {
    nodes: [
      ...nodes,
      {
        id: "PurchaseOrder",
        data: { label: "Group A" },
        position: { x: 100, y: 100 },
        className: "light",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          // width: 200,
          // height: 200,
        },
      },
      {
        id: "PurchaseItem",
        data: { label: "Group A" },
        position: { x: 100, y: 100 },
        className: "light",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          // width: 200,
          // height: 200,
        },
      },
      {
        id: "Shipment",
        data: { label: "Group A" },
        position: { x: 100, y: 100 },
        className: "light",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          // width: 200,
          // height: 200,
        },
      },
      {
        id: "PurchaseOrder",
        data: { label: "Group A" },
        position: { x: 100, y: 100 },
        className: "light",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          // width: 200,
          // height: 200,
        },
      },
    ],

    edges,
  };
};

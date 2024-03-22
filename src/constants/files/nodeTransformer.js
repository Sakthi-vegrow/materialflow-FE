import { edgeColors } from "./entities";

export const transformToNodesAndEdges = (data, selectedNodes = []) => {
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
    nodes,

    edges,
  };
};

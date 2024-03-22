export const transformToNodesAndEdges = (data) => {
  let nodes = [];
  let edges = [];

  const traverse = (node, parentId, depth = 0) => {
    let currentNode = {
      id: node.node_id,
      data: {
        label: node.node_id,
        ...node,
      },
      position: { x: 0, y: 0 },
      depth,
      type: node.node_id.split("-")?.[0] || "PurchaseOrder",
    };

    if (parentId) {
      edges.push({
        id: `e${parentId}-${node.node_id}`,
        source: parentId,
        target: node.node_id,
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

  return { nodes, edges };
};

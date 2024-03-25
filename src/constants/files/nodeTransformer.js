import { edgeColors } from "./entities";
import { MarkerType } from "reactflow";

export const transformToNodesAndEdges = (data) => {
  let nodes = [];
  let edges = [];

  const traverse = (node, parentId, depth = 0) => {
    if (node.nodeid) {
      alert("Present");
    } else {
      console.info("Not Present: ", node);
    }
    let [entity, levelId] = node.node_id?.split("-");

    let currentNode = {
      id: node.node_id,
      data: {
        label: node.node_id,
        ...node,
        // isSelected: selectedNodes.includes(levelId),
        isSelected: false,
      },
      position: { x: 0, y: 0 },
      depth,
      type: entity || "PurchaseOrder",
    };

    if (parentId) {
      console.log("Node: ", node);
      edges.push({
        id: `e${parentId}-${node.node_id}`,
        source: parentId,
        target: node.node_id,
        style: {
          stroke: edgeColors[parentId.split("-")[0]],
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColors[parentId.split("-")[0]],
          width: 18,
          height: 18,
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

export const convertJsonToNodesAndEdges = (
  jsonData,
  oldGraphData,
  showLeaf = false
) => {
  var nodes = [];
  var edges = [];

  if (showLeaf == true) {
    nodes = [];
    edges = [];

    let currentNode = {
      id: oldGraphData.node_id,
      data: {
        label: oldGraphData.node_id,
        ...oldGraphData,
        isSelected: false,
      },
      position: { x: 0, y: 0 },
      depth: 0,
      type: entity || "PurchaseOrder",
    };

    nodes.push(currentNode);

    jsonData.map((node) => {
      let currentNode = {
        id: node.node_id,
        data: {
          label: node.node_id,
          ...node,
          isSelected: false,
        },
        position: { x: 0, y: 0 },
        depth: 0,
        type: entity || "PurchaseOrder",
      };

      const edgeId = `e${oldGraphData.node_id}-${node.node_id}`;
      edges.push({
        id: edgeId,
        source: oldGraphData.node_id,
        target: node.node_id,
        // Assuming edge colors and marker type are predefined
        style: { stroke: "#000" }, // You can customize edge style here
        markerEnd: { type: "arrow" }, // You can customize marker type here
      });

      nodes.push(currentNode);
    });
  } else {
    nodes = oldGraphData.nodes || [];
    edges = oldGraphData.edges || [];

    const existingNodeIds = new Set(nodes.map((node) => node.id));
    const existingEdgeIds = new Set(edges.map((edge) => edge.id));

    Object.keys(jsonData).forEach((key) => {
      const node = jsonData[key];
      let [entity, levelId] = node.node_id.split("-");

      if (!existingNodeIds.has(node.node_id)) {
        let currentNode = {
          id: node.node_id,
          data: {
            label: node.node_id,
            ...node,
            isSelected: false,
          },
          position: { x: 0, y: 0 },
          depth: 0,
          type: entity || "PurchaseOrder",
        };

        nodes.push(currentNode);
        existingNodeIds.add(node.node_id);
      }

      if (node.parent_id && node.parent_id.length > 0) {
        node.parent_id.forEach((parentId) => {
          const edgeId = `e${parentId}-${node.node_id}`;
          if (!existingEdgeIds.has(edgeId)) {
            edges.push({
              id: edgeId,
              source: parentId,
              target: node.node_id,
              // Assuming edge colors and marker type are predefined
              style: { stroke: "#000" }, // You can customize edge style here
              markerEnd: { type: "arrow" }, // You can customize marker type here
            });
            existingEdgeIds.add(edgeId);
          }
        });
      }
    });
  }
  return { nodes, edges };
};

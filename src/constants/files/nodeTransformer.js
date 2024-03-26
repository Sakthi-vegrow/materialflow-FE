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
  showLeaf = false,
  showFullGraph = true
) => {
  var nodes = [];
  var edges = [];

  if (showLeaf == true) {
    nodes = [];
    edges = [];
    const encounteredIds = new Set();

    let currentNode = {
      id: `${oldGraphData.entity}-${oldGraphData.id}`,
      data: {
        label: `${oldGraphData.entity}-${oldGraphData.id}`,
        isSelected: false,
        name: `${oldGraphData.entity}`,
        node_id: `${oldGraphData.entity}-${oldGraphData.id}`,
      },

      position: { x: 0, y: 0 },
      depth: 0,
      type: oldGraphData.entity || "PurchaseOrder",
    };

    nodes.push(currentNode);

    Object.keys(jsonData).forEach((key) => {
      const node = jsonData[key];
      let [entity, levelId] = node.node_id.split("-");
      if (!encounteredIds.has(node.node_id)) {
        // Check if node ID has been encountered before
        let currentNode = {
          id: node.node_id,
          data: {
            label: node.node_id,
            ...node,
            isSelected: false,
          },
          position: { x: 0, y: 0 },
          depth: 1,
          type: entity || "PurchaseOrder",
        };
        nodes.push(currentNode);
        encounteredIds.add(node.node_id);

        const edgeId = `e${`${oldGraphData.entity}-${oldGraphData.id}`}-${
          node.node_id
        }`;

        edges.push({
          id: edgeId,
          source: `${oldGraphData.entity}-${oldGraphData.id}`,
          target: node.node_id,
          // Assuming edge colors and marker type are predefined
          style: {
            stroke: edgeColors[oldGraphData.entity],
            strokeWidth: "1.5px",
          }, // You can customize edge style here
          markerEnd: {
            type: "arrow",
            width: 20,
            height: 20,
            color: edgeColors[oldGraphData.entity],
          }, // You can customize marker type here
        });
      }
    });
  } else {
    nodes = oldGraphData.nodes || [];
    edges = oldGraphData.edges || [];
    if (showFullGraph == false) {
      nodes = [];
      edges = [];
    }
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
          console.log(parentId.split("-")[0]);
          if (!existingEdgeIds.has(edgeId)) {
            edges.push({
              id: edgeId,
              source: parentId,
              target: node.node_id,
              style: {
                stroke: edgeColors[parentId.split("-")[0]],
                strokeWidth: "1.5px",
              },
              markerEnd: {
                type: "arrow",
                width: 20,
                height: 20,
                color: edgeColors[parentId.split("-")[0]],
              }, // You can customize marker type here
            });
            existingEdgeIds.add(edgeId);
          }
        });
      }
    });
  }
  return { nodes, edges };
};

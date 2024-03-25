import axios from "axios";
import { useEffect, useState } from "react";
import LayoutFlow from "../../components/DagreAutoLayout";
import { convertJsonToNodesAndEdges } from "../../constants/files/nodeTransformer";
import { URL } from "../../../env";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import { Backdrop, CircularProgress } from "@mui/material";
import ButtonAppBar from "../ButtonAppBar";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { ENTITIES } from "../../constants";
import NodesBreadcrumbs from "../../components/DagreAutoLayout/helpers/NodesBreadCrumb";

export const GraphView = () => {
  const { id, entity } = useParams();
  const [rev] = useSearchParams();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(5);
  const [showFullGraph, setShowFullGraph] = useState(true);
  const [viewPort, setViewPort] = useState({ x: 0, y: 0 });
  const [entityDetails, setEntityDetails] = useState({});

  const [selectedNodes, setSelectedNodes] = useState([]);

  useEffect(() => {
    setEntityDetails({
      id,
      entity,
    });
  }, [id, entity]);

  useEffect(() => {
    fetchGraphData(entity, id);
    return () => {};
  }, []);

  const fetchGraphData = (entity, id) =>
    // entity = "PurchaseOrder",
    // levelId = 19524,
    {
      setLoading(true);
      axios
        .get(
          URL +
            `material_flow/graph_traverse?entity=${entity}&entity_id=${id}&layers=5&reverse=${rev.get(
              "reverse"
            )}`,
          {
            headers: { "ngrok-skip-browser-warning": true },
          }
        )
        .then(({ data }) => {
          setGraphData(convertJsonToNodesAndEdges(data, graphData, false));
          setLoading(false);
        })
        .catch(console.log);
    };

  const handleNodeClick = (e, node) => {
    if (node.is_leaf) {
      alert("Its a leaf");
      return;
    }

    let [entity, levelId] = node.data.label.split("-");
    const newLevel = level + level;

    setSelectedNodes((nodes) =>
      nodes.some((prevNode) => prevNode.id === node.id)
        ? nodes
        : [...nodes, node]
    );
    if (!showFullGraph) {
      fetchGraphData(entity, levelId);
    } else {
      setViewPort(node.position);
      setLevel(newLevel);
      fetchGraphData(entity, levelId);
    }
  };

  const updateHistoryNodes = (node) => {
    alert(node.id);
    const newNodes = [];
    for (const obj of selectedNodes) {
      newNodes.push(obj);

      if (obj.id === node.id) {
        break; // Stop looping once the target object is found
      }
    }
    console.log("New nodes: ", newNodes);
    setSelectedNodes(newNodes);
  };

  useEffect(() => {
    console.log("SelectedNodes: ", selectedNodes);
  }, [selectedNodes]);

  useEffect(() => {
    console.log("Updated GraphData: ", graphData, "LEVEL: ", level);
  }, [graphData]);

  return (
    <ReactFlowProvider>
      <div className="">
        <ButtonAppBar />

        <NodesBreadcrumbs
          activeNodes={selectedNodes}
          fetchGraph={fetchGraphData}
          activate={!showFullGraph}
          updateHistory={updateHistoryNodes}
        />

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {graphData.nodes.length ? (
          <LayoutFlow
            initialNodes={[...graphData.nodes]}
            initialEdges={[...graphData.edges]}
            onNodeClick={handleNodeClick}
            setLevel={setLevel}
            level={level}
            // viewPort={viewPort}
            setShowFullGraph={setShowFullGraph}
            showFullGraph={showFullGraph}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div>
        )}
      </div>
    </ReactFlowProvider>
  );
};

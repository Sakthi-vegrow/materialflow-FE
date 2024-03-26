import axios from "axios";
import { useEffect, useState } from "react";
import LayoutFlow from "../../components/DagreAutoLayout";
import { convertJsonToNodesAndEdges } from "../../constants/files/nodeTransformer";
import { URL } from "../../../env";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import { Backdrop, CircularProgress } from "@mui/material";
import ButtonAppBar from "../ButtonAppBar";
import { useParams } from "react-router";
import { useSearchParams, useLocation } from "react-router-dom";
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
  const [fetchleaf, setFetchleaf] = useState();

  useEffect(() => {
    setEntityDetails({
      id,
      entity,
    });
    // setSelectedNodes([{ entity, id }]);
  }, [id, entity]);

  useEffect(() => {
    console.log("params: ", rev.get("fetchleaf"));
    setFetchleaf(rev.get("fetchleaf") == "true");
    return () => {};
  }, []);

  useEffect(() => {
    if (fetchleaf != null) fetchGraphData(entity, id);
  }, [fetchleaf]);

  const fetchGraphData = (entity, id) => {
    setLoading(true);
    console.log("FETCHLEAF from API: ", fetchleaf);
    if (fetchleaf) {
      axios
        .post(URL + `material_flow/get_endpoints.json`, {
          headers: { "ngrok-skip-browser-warning": true },
          csv_data: [{ entity: entity, id: id }],
          reverse: rev.get("reverse") === "true",
        })
        .then(({ data }) => {
          setGraphData(convertJsonToNodesAndEdges(data, { entity, id }, true));
          setLoading(false);
        })
        .catch(console.log);
    } else {
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
          setGraphData(
            convertJsonToNodesAndEdges(data, graphData, false, true)
          );
          setLoading(false);
        })
        .catch(console.log);
    }
  };

  const handleNodeClick = (e, node) => {
    if (node.data?.is_leaf || fetchleaf) {
      e.preventDefault();
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
    const newNodes = [];
    for (const obj of selectedNodes) {
      newNodes.push(obj);

      if (obj.id === node.id) {
        break; // Stop looping once the target object is found
      }
    }
    setSelectedNodes(newNodes);
  };

  useEffect(() => {
    console.log("SelectedNodes: ", selectedNodes);
  }, [selectedNodes]);

  useEffect(() => {
    console.log(
      "Updated GraphData=> \nnodes:  ",
      graphData.nodes,
      " edges: ",
      graphData.edges
    );
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

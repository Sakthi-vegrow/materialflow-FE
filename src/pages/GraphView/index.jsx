import axios from "axios";
import { useEffect, useState } from "react";
import LayoutFlow from "../../components/DagreAutoLayout";
import { transformToNodesAndEdges } from "../../constants/files/nodeTransformer";
import { URL } from "../../../env";
import { ReactFlowProvider } from "reactflow";
import { Backdrop, CircularProgress } from "@mui/material";
import ButtonAppBar from "../ButtonAppBar";
import { useParams } from "react-router";

export const GraphView = () => {
  const { id, entity } = useParams();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(2);
  const [showFullGraph, setShowFullGraph] = useState(false);
  const [viewPort, setViewPort] = useState({ x: 0, y: 0 });

  const [entityDetails, setEntityDetails] = useState({
    entity: "PurchaseOrder",
    id: 19524,
  });

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

  const fetchGraphData = (
    entity = "PurchaseOrder",
    levelId = 19524,
    level = 2
  ) => {
    setLoading(true);
    axios
      .get(
        URL +
          `material_flow/index?entity=${entity}&entity_id=${levelId}&layers=${level}`,
        {
          headers: { "ngrok-skip-browser-warning": true },
        }
      )
      .then(({ data }) => {
        setGraphData(transformToNodesAndEdges(data));
        setLoading(false);
      })
      .catch(console.log);
  };

  const handleNodeClick = (e, node) => {
    console.log(node);

    if (node.is_leaf) {
      alert("Its a leaf");
      return;
    }

    let [entity, levelId] = node.data.label.split("-");
    const newLevel = node.depth + 2;

    if (!showFullGraph) {
      fetchGraphData(entity, levelId);
    } else {
      setViewPort(node.position);
      setLevel((level) => level + newLevel);
      fetchGraphData(entityDetails.entity, entityDetails.id, level + newLevel);
    }
  };
  return (
    <div className="">
      <ButtonAppBar />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {graphData.nodes.length ? (
        <ReactFlowProvider>
          <LayoutFlow
            initialNodes={graphData.nodes}
            initialEdges={graphData.edges}
            onNodeClick={handleNodeClick}
            setLevel={setLevel}
            level={level}
            viewPort={viewPort}
            setShowFullGraph={setShowFullGraph}
            showFullGraph={showFullGraph}
          />
        </ReactFlowProvider>
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
  );
};

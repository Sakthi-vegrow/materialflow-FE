import axios from "axios";
import { useEffect, useState } from "react";
import LayoutFlow from "../../components/DagreAutoLayout";
import { transformToNodesAndEdges } from "../../constants/files/nodeTransformer";
import { URL } from "../../../env";

export const GraphView = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    fetchGraphData();
    return () => {};
  }, []);

  const fetchGraphData = () => {
    axios
      .get(
        URL +
          "material_flow/index?entity=PurchaseOrder&entity_id=19524&layers=10",
        {
          headers: { "ngrok-skip-browser-warning": true },
        }
      )
      .then(({ data }) => {
        console.log(data, "--");
        console.log(transformToNodesAndEdges(data));
        setGraphData(transformToNodesAndEdges(data));
      })
      .catch(console.log);
  };

  return (
    <div className="">
      {graphData.nodes.length ? (
        <LayoutFlow
          initialNodes={graphData.nodes}
          initialEdges={graphData.edges}
        />
      ) : (
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Loading ...</h1>
        </div>
      )}
    </div>
  );
};

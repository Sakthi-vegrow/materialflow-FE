import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  MiniMap,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Background,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import {
  Button,
  ButtonGroup,
  Container,
  Grid,
  Stack,
  Switch,
} from "@mui/material";
import { Node } from "../Nodes/Node";
import Edge from "../Edges/Edge";
import { useSearchParams } from "react-router-dom";

const label = { inputProps: { "aria-label": "Clear Old Nodes" } };

export const Layout = {
  HORIZONTAL: "LR",
  VERTICAL: "TB",
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const LayoutFlow = ({
  initialNodes,
  initialEdges,
  onNodeClick,
  // setLevel,
  // level,
  viewPort,
  showFullGraph,
  setShowFullGraph,
  fitMyView,
  setFitMyView,
}) => {
  const { fitView } = useReactFlow();

  const [nodesData, setNodesData] = useState([]);
  const [layout, setLayout] = useState(Layout.VERTICAL);
  const [edgesData, setEdgesData] = useState([]);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData);
  const [fetchleaf, setFetchleaf] = useState(false);

  const [rev] = useSearchParams();

  const nodeTypes = useMemo(
    () => ({
      PurchaseOrder: (props) => <Node {...props} layout={layout} />,
      PurchaseItem: (props) => <Node {...props} layout={layout} />,
      Shipment: (props) => <Node {...props} layout={layout} />,
      Lot: (props) => <Node {...props} layout={layout} />,
      SaleOrder: (props) => <Node {...props} layout={layout} />,
      SaleOrderItem: (props) => <Node {...props} layout={layout} />,
      Regrading: (props) => <Node {...props} layout={layout} />,
    }),
    [layout]
  );

  const edgeTypes = useMemo(
    () => ({
      PurchaseOrder: Edge,
      PurchaseItem: Edge,
      Shipment: Edge,
      Lot: Edge,
      SaleOrderItem: Edge,
      Regrading: Edge,
    }),
    []
  );

  const nodeWidth = layout == Layout.HORIZONTAL ? 400 : 172;
  const nodeHeight = layout == Layout.HORIZONTAL ? 200 : 300;

  const getLayoutedElements = (nodes, edges, direction = "TB") => {
    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? "left" : "top";
      node.sourcePosition = isHorizontal ? "right" : "bottom";

      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      layout
    );
    console.log("Nodes: ", layoutedNodes);
    setNodes(layoutedNodes);
    console.log("Edges: ", layoutedEdges);
    setEdges(layoutedEdges);

    return () => {
      setNodesData([]);
      setEdgesData([]);
    };
  }, [initialNodes, initialEdges, layout]);

  useEffect(() => {
    console.log("FROM LAYOUT: ", initialNodes, initialEdges);
  }, [initialNodes]);

  useEffect(() => {
    // if(showFullGraph)
    // flowToScreenPosition({ x: 1000, y: 1000 });
    // setViewport(viewPort);
    return () => {};
  }, [viewPort]);

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  useEffect(() => {
    setFetchleaf(rev.get("fetchleaf"));
  }, []);

  return (
    <div style={{ height: "90vh", width: "100vw", overflow: "scroll" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={false}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        panOnScroll
        onNodeClick={onNodeClick}
        defaultViewport={viewPort}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Background color="black" style={{ background: "#fff" }} />

        <Controls style={{ position: "fixed", bottom: "100" }} />
        <MiniMap nodeStrokeWidth={3} />

        <Panel position="top-left">
          <Stack
            spacing={1}
            direction="row"
            alignContent={"center"}
            justifyContent={"center"}
          >
            <Grid Container>
              <Button
                variant="contained"
                onClick={() =>
                  setLayout(
                    layout == Layout.VERTICAL
                      ? Layout.HORIZONTAL
                      : Layout.VERTICAL
                  )
                }
                size="small"
                sx={{
                  transform: `${
                    layout != Layout.VERTICAL ? "rotate(90deg)" : "rotate(0deg)"
                  }`,
                  transformOrigin: "left center",
                  gap: 0.7,
                  position: "fixed",
                  left: `${layout != Layout.VERTICAL ? "20px" : "10px"}`,
                  top: `${
                    fetchleaf
                      ? layout != Layout.VERTICAL
                        ? "60px"
                        : "75px"
                      : layout != Layout.VERTICAL
                      ? "105px"
                      : "115px"
                  }`,
                  fontSize: 10,
                  fontWeight: "bold",
                  transition: "all 0.1s ease-in-out",
                  background: "#8b3dff",
                  "&:hover": {
                    background: "#6b2bcc",
                  },
                }}
              >
                {layout != Layout.VERTICAL ? (
                  <>
                    <span style={{ transform: "rotate(-90deg)" }}>V</span>
                    <span style={{ transform: "rotate(-90deg)" }}>E</span>
                    <span style={{ transform: "rotate(-90deg)" }}>R</span>
                    <span style={{ transform: "rotate(-90deg)" }}>T</span>
                    <span style={{ transform: "rotate(-90deg)" }}>I</span>
                    <span style={{ transform: "rotate(-90deg)" }}>C</span>
                    <span style={{ transform: "rotate(-90deg)" }}>A</span>
                    <span style={{ transform: "rotate(-90deg)" }}>L</span>
                  </>
                ) : (
                  <>
                    <span style={{ transform: "rotate(0deg)" }}>H</span>
                    <span style={{ transform: "rotate(0deg)" }}>O</span>
                    <span style={{ transform: "rotate(0deg)" }}>R</span>
                    <span style={{ transform: "rotate(0deg)" }}>I</span>
                    <span style={{ transform: "rotate(0deg)" }}>Z</span>
                    <span style={{ transform: "rotate(0deg)" }}>O</span>
                    <span style={{ transform: "rotate(0deg)" }}>N</span>
                    <span style={{ transform: "rotate(0deg)" }}>T</span>
                    <span style={{ transform: "rotate(0deg)" }}>A</span>
                    <span style={{ transform: "rotate(0deg)" }}>L</span>
                  </>
                )}
              </Button>
            </Grid>
            {!fetchleaf && (
              <div style={{ position: "fixed", right: 10, top: 75 }}>
                <Switch
                  {...label}
                  name="Show Full Graph"
                  checked={showFullGraph}
                  size="small"
                  onChange={() => {
                    setShowFullGraph((val) => !val);
                  }}
                  sx={{
                    "& .MuiSwitch-thumb": { backgroundColor: "#8b3dff" }, // Handle color
                    "& .MuiSwitch-track": {
                      backgroundColor: "#8b3dff !important",
                    },
                  }}
                />
                <span style={{ fontSize: 10 }}>Full Graph</span>
              </div>
            )}
            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={level}
              label="Age"
              onChange={({ target: { value } }) => setLevel(value)}
              size="small"
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select> */}
          </Stack>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default LayoutFlow;

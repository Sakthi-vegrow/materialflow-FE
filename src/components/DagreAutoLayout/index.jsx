import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  MiniMap,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import { Button, ButtonGroup, Stack, Switch } from "@mui/material";

const label = { inputProps: { "aria-label": "Clear Old Nodes" } };

const Layout = {
  HORIZONTAL: "LR",
  VERTICAL: "TB",
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

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

const LayoutFlow = ({
  initialNodes,
  initialEdges,
  onNodeClick,
  // setLevel,
  // level,
  viewPort,
  showFullGraph,
  setShowFullGraph,
}) => {
  const { fitView } = useReactFlow();

  const [nodesData, setNodesData] = useState([]);
  const [layout, setLayout] = useState(Layout.HORIZONTAL);
  const [edgesData, setEdgesData] = useState([]);

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesData);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesData);

  // const nodeTypes = { textUpdater: PurchaseOrderNode };

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
      layout
    );

    console.log(layoutedNodes, "HERE");
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    return () => {
      setNodesData([]);
      setEdgesData([]);
    };
  }, [initialNodes, initialEdges, layout]);

  useEffect(() => {
    // if (!showFullGraph)
    fitView();
    return () => {};
  }, [nodes]);

  useEffect(() => {
    // if(showFullGraph)
    // flowToScreenPosition({ x: 1000, y: 1000 });
    // setViewport(viewPort);
    return () => {};
  }, [viewPort]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    []
  );

  return (
    <div style={{ height: "90vh", width: "90vw", overflow: "scroll" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        panOnScroll
        onNodeClick={onNodeClick}
        defaultViewport={viewPort}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} />

        <Panel position="top-left">
          <Stack
            spacing={1}
            direction="row"
            alignContent={"center"}
            justifyContent={"center"}
          >
            <ButtonGroup
              variant="contained"
              aria-label="Basic button group"
              size="small"
              sx={{ height: 20, width: 120, fontSize: 8 }}
            >
              <Button
                variant={Layout.VERTICAL === layout ? "contained" : "outlined"}
                onClick={() => setLayout(Layout.VERTICAL)}
                size="small"
                sx={{ fontSize: 8 }}
              >
                Vertical
              </Button>

              <Button
                variant={
                  Layout.HORIZONTAL === layout ? "contained" : "outlined"
                }
                onClick={() => setLayout(Layout.HORIZONTAL)}
                size="small"
                sx={{ fontSize: 8 }}
              >
                Horizontal
              </Button>
            </ButtonGroup>
            <div>
              <Switch
                {...label}
                name="Show Full Graph"
                checked={showFullGraph}
                size="small"
                onChange={() => {
                  setShowFullGraph((val) => !val);
                }}
              />
              <span style={{ fontSize: 10 }}>Show Full Graph</span>
            </div>

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

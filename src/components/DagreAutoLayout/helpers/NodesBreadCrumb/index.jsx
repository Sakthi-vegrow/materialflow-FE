import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { ENTITIES, THEME } from "../../../../constants";
import styled from "styled-components";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../capitalizeFirstLetter";

// const StyledBreadcrumb = styled(Chip)(() => {
//     const backgroundColor = "#a7a7a7";
//     return {
//       backgroundColor,
//       height: 100,
//       color: "red",
//       fontWeight: 200,
//       "&:hover, &:focus": {
//         backgroundColor: emphasize(backgroundColor, 0.06),
//       },
//       "&:active": {
//         boxShadow: "1px",
//         backgroundColor: emphasize(backgroundColor, 0.12),
//       },
//     };
//   });

const Container = styled("div")({
  padding: "10px 20px 10px 20px",
  border: "1px solid lightgrey",
});

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    border: "1px solid #dadde9",
    textAlign: "center",
  },
}));

const DataItem = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const NodesBreadcrumbs = ({
  activeNodes,
  fetchGraph,
  activate,
  updateHistory,
}) => {
  const handleClick = (event, node) => {
    // console.log("Event: ", node);
    event.preventDefault();
    let [entity, id] = node.id.split("-");
    updateHistory(node);
    fetchGraph(entity, id);
  };
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // const handleTooltipOpen = () => {
  //   setTooltipOpen(true);
  // };
  // const handleTooltipClose = () => {
  //   setTooltipOpen(false);
  // };

  useEffect(() => {
    // console.log("Nodes for bread: ", activeNodes);
  }, [activeNodes]);

  return (
    <Container role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        {activate && activeNodes.length > 0 ? (
          activeNodes.map((node) => {
            return (
              <Link
                underline="hover"
                color="inherit"
                key={node.id}
                sx={{
                  cursor: "pointer",
                  userSelect: "none",
                }}
                onClick={(e) => handleClick(e, node)}
              >
                <HtmlTooltip
                  title={
                    <DataItem style={{}}>
                      <span style={{ fontWeight: "bold" }}>
                        {capitalizeFirstLetter(node?.id).split("-")[0]}
                      </span>
                      <br />
                      <span style={{}}>{node?.id.split("-")[1]}</span>
                    </DataItem>
                  }
                >
                  {node.id.split("-")[0]}
                </HtmlTooltip>
              </Link>
            );
          })
        ) : (
          <span>Your history will appear here..</span>
        )}
      </Breadcrumbs>
    </Container>
  );
};

export default NodesBreadcrumbs;

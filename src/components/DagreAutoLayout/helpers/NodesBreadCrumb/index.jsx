import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { ENTITIES, THEME } from "../../../../constants";
import styled from "styled-components";

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

export default function NodesBreadcrumbs({
  activeNodes,
  fetchGraph,
  activate,
  updateHistory,
}) {
  const handleClick = (event, node) => {
    console.log("Event: ", node);
    event.preventDefault();
    let [entity, id] = node.id.split("-");
    updateHistory(node);
    fetchGraph(entity, id);
  };

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
                {node.id.split("-")[0]}
              </Link>
            );
          })
        ) : (
          <span>Your history will appear here..</span>
        )}
      </Breadcrumbs>
    </Container>
  );
}

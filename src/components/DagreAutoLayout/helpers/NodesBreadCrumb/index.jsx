import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { ENTITIES, THEME } from "../../../../constants";
import styled from "styled-components";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

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
  padding: 20,
  border: "1px solid lightgrey",
});

export default function NodesBreadcrumbs({ activeNodes }) {
  console.log(activeNodes, ENTITIES);
  return (
    <Container role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb">
        {ENTITIES.map((entity) => {
          return (
            <Link
              underline="hover"
              color="inherit"
              href="/"
              key={entity}
              style={{
                color: activeNodes?.includes(entity)
                  ? THEME.primary
                  : THEME.grey,
              }}
            >
              {entity}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Container>
  );
}

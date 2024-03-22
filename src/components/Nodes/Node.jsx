import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useState } from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";
import { entities } from "../../constants/files/entities";
import { Button, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

const handleStyle = { left: 10 };

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const DataContainer = styled("div")({
  padding: 20,
  paddingTop: 30,
  border: "1px solid lightgrey",
  minWidth: "100px",
});

const DataItem = styled("div")({
  display: "grid",
});

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    width: 250,
    maxWidth: 300,
    border: "1px solid #dadde9",
  },
}));

export const Node = ({ data }) => {
  const [expand, setExpand] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const expandHandler = () => {
    setExpand((expand) => {
      return !expand;
    });
  };

  const handleTooltipOpen = () => {
    expand ? setTooltipOpen(false) : setTooltipOpen(true);
  };
  const handleTootltipClose = () => {
    setTooltipOpen(false);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />

      <HtmlTooltip
        onOpen={handleTooltipOpen}
        open={tooltipOpen}
        onClose={handleTootltipClose}
        title={Object.keys(data?.details).map((key) => {
          return (
            <DataItem
              style={{ gridTemplateColumns: "1fr 1fr" }}
              key={data?.details?.identifier}
            >
              <span style={{ fontWeight: "bold" }}>
                {capitalizeFirstLetter(key)}
              </span>
              <span
                style={{
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "right",
                }}
              >
                {data?.details[key]}
              </span>
            </DataItem>
          );
        })}
      >
        {" "}
        <DataContainer style={{ backgroundColor: `${entities[data?.name]}` }}>
          {!expand ? (
            <DataItem style={{ textAlign: "center" }}>
              {data?.name}
              <br />
              {data?.node_id?.split("-").slice(1)}
              <br />
              <div style={{ position: "absolute", right: 0, top: 0 }}>
                <IconButton onClick={(e) => expandHandler()}>
                  {expand ? (
                    <CloseOutlinedIcon />
                  ) : (
                    <ArrowDropDownOutlinedIcon />
                  )}
                </IconButton>
              </div>
            </DataItem>
          ) : (
            <>
              <DataItem style={{ gridTemplateColumns: "1fr 1fr" }}>
                <span style={{ fontWeight: "bold" }}>Entity </span>
                <span
                  style={{
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                  }}
                >
                  {data?.name}
                </span>
              </DataItem>{" "}
              <DataItem style={{ gridTemplateColumns: "1fr 1fr" }}>
                <span style={{ fontWeight: "bold" }}>ID </span>
                <span
                  style={{
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "right",
                  }}
                >
                  {data?.node_id.split("-").slice(1)}
                </span>
              </DataItem>{" "}
              {Object.keys(data?.details).map((key) => {
                return (
                  <DataItem
                    style={{ gridTemplateColumns: "1fr 1fr" }}
                    key={data?.details?.identifier}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {capitalizeFirstLetter(key)}
                    </span>
                    <span
                      style={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textAlign: "right",
                      }}
                    >
                      {data?.details[key]}
                    </span>
                  </DataItem>
                );
              })}
              <div style={{ position: "absolute", right: 0, top: 0 }}>
                <IconButton onClick={(e) => expandHandler()}>
                  {expand ? (
                    <CloseOutlinedIcon />
                  ) : (
                    <ArrowDropDownOutlinedIcon />
                  )}
                </IconButton>
              </div>
            </>
          )}
        </DataContainer>
      </HtmlTooltip>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
};

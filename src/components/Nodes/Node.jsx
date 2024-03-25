import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";
import { entities } from "../../constants/files/entities";
import { Button, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import "./Node.css";
import { Layout } from "../DagreAutoLayout";

const handleStyle = { left: 10 };

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const DataContainer = styled("div")({
  padding: 20,
  paddingTop: 30,
  border: "1px solid lightgrey",
  minWidth: "100px",
  border: "1px solid black !important",
  borderRadius: "5px",
  "&:hover": {
    border: "1px solid #8b3dff !important",
  },
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

const InnerTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #dadde9",
  },
}));

export const Node = ({ data, layout }) => {
  const [expand, setExpand] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const expandHandler = (e) => {
    setExpand((expand) => {
      return !expand;
    });
    e.stopPropagation();
  };

  const handleTooltipOpen = () => {
    expand ? setTooltipOpen(false) : setTooltipOpen(true);
  };
  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  return (
    <>
      {data.parent_id && (
        <Handle
          type="target"
          position={layout == Layout.HORIZONTAL ? Position.Left : Position.Top}
          style={{}}
        />
      )}
      {data.details && (
        <HtmlTooltip
          onOpen={handleTooltipOpen}
          open={tooltipOpen}
          onClose={handleTooltipClose}
          title={Object.keys(data?.details).map((key, index) => (
            <DataItem style={{ gridTemplateColumns: "1fr 1fr" }} key={index}>
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
          ))}
        >
          {" "}
          <DataContainer
            style={{
              backgroundColor: `${
                data?.is_leaf ? "#4CCD99" : entities[data?.name]
              }`,
            }}
          >
            {!expand ? (
              <DataItem style={{ textAlign: "center" }}>
                <span style={{ color: "#5928E5" }}>{data?.name}</span>
                <br />
                <span style={{ color: "#E91E63" }}>
                  {data?.node_id?.split("-").slice(1)}
                </span>
                <br />
                <div style={{ position: "absolute", right: 0, top: 0 }}>
                  <IconButton onClick={(e) => expandHandler(e)}>
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
                <DataItem style={{ gridTemplateColumns: "1fr 0.5fr" }}>
                  <span style={{ fontWeight: "bold", color: "#5928E5" }}>
                    Entity{" "}
                  </span>
                  <span
                    style={{
                      minWidth: "150px",
                      maxWidth: "250px",

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "right",
                      color: "#E91E63",
                    }}
                  >
                    {data?.name}
                  </span>
                </DataItem>{" "}
                <DataItem style={{ gridTemplateColumns: "1fr 0.5fr" }}>
                  <span style={{ fontWeight: "bold", color: "#5928E5" }}>
                    ID{" "}
                  </span>
                  <span
                    style={{
                      minWidth: "150px",
                      maxWidth: "250px",

                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textAlign: "right",
                      color: "#E91E63",
                    }}
                  >
                    {data?.node_id.split("-").slice(1)}
                  </span>
                </DataItem>{" "}
                {data.details &&
                  Object.keys(data?.details).map((key) => {
                    return (
                      <DataItem
                        style={{
                          gridTemplateColumns: "1fr 0.5fr",
                        }}
                        key={data?.details?.identifier}
                      >
                        <span style={{ fontWeight: "bold", color: "#5928E5" }}>
                          {capitalizeFirstLetter(key)}
                        </span>
                        <InnerTooltip
                          sx={{ background: "white" }}
                          title={data?.details[key]}
                        >
                          <span
                            style={{
                              minWidth: "150px",
                              maxWidth: "250px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              textAlign: "right",
                              color: "#E91E63",
                            }}
                          >
                            {data?.details[key]}
                          </span>
                        </InnerTooltip>
                      </DataItem>
                    );
                  })}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                >
                  <IconButton onClick={(e) => expandHandler(e)}>
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
      )}
      <Handle
        type="source"
        position={
          layout == Layout.HORIZONTAL ? Position.Right : Position.Bottom
        }
        id="a"
        style={{}}
      />
    </>
  );
};

import { Button } from "@mui/material";
import { useState } from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";

const handleStyle = { left: 10 };

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const DataContainer = styled("div")({
  padding: 20,
  border: "1px solid lightgrey",
});

const DataItem = styled("div")({
  padding: 20,
  display: "flex",
  justifyContent: "space-between",
});

export const Node = ({ data }) => {
  const [expand, setExpand] = useState(false);

  const expandHandler = () => {
    alert(expand);
    setExpand(!expand);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />

      <DataContainer>
        {expand ? (
          Object.keys(data?.details).map((key) => {
            return (
              <DataItem
                key={data?.details?.identifier}
                onClick={(e) => {
                  expandHandler();
                }}
              >
                <div>{capitalizeFirstLetter(key)} :</div>

                <div>{data?.details[key]}</div>
              </DataItem>
            );
          })
        ) : (
          <DataItem
            onClick={(e) => {
              console.log("called");
              expandHandler();
            }}
          >
            {capitalizeFirstLetter(data?.name)}
          </DataItem>
        )}
      </DataContainer>
      <Handle type="source" position={Position.Right} id="a" />
    </>
  );
};

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

export const PurchaseOrderNode = ({ data }) => {
  console.log(data);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <DataContainer>
        {Object.keys(data?.details).map((key) => {
          return (
            <DataItem key={data?.details?.identifier}>
              <div>{capitalizeFirstLetter(key)} :</div>

              <div>{data?.details[key]}</div>
            </DataItem>
          );
        })}
      </DataContainer>
      <Handle type="source" position={Position.Right} id="a" />
      <Handle
        type="source"
        position={Position.Left}
        id="b"
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="b"
        style={handleStyle}
      />

      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={handleStyle}
      />
    </>
  );
};

import React, { useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";

function HomeInput() {
  const [purchaseOrderId, setPurchaseOrderId] = useState();

  const handleFormInput = (e) => {
    setPurchaseOrderId(e.target.value);
    alert(e.target.value);
  };

  return (
    <CenteredContainer sx={{}}>
      <TitleText>Material Flow Visualization</TitleText>
      <FormCard>
        <FormCardContent>
          <Typography sx={{ fontSize: 18 }}>
            Enter Purchase Order ID:
          </Typography>
          <FormInput
            label="ID"
            variant="outlined"
            value={purchaseOrderId}
            onChange={handleFormInput}
          />
          <FormSubmitBtn variant="contained">
            <AlignVerticalCenterIcon /> Visualize
          </FormSubmitBtn>
        </FormCardContent>
      </FormCard>
    </CenteredContainer>
  );
}

export default HomeInput;

const CenteredContainer = styled(Container)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "#F8F8F8",
});

const TitleText = styled(Typography)({
  textTransform: "uppercase",
  fontSize: 32,
  marginBottom: 40,
  color: "green",
});

const FormCard = styled(Card)({
  padding: 20,
  minHeight: 250,
  minWidth: 350,
});

const FormCardContent = styled(CardContent)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-evenly",
});

const FormInput = styled(TextField)({});

const FormSubmitBtn = styled(Button)({
  background: "green",
});

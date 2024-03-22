import React, { useState } from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import Grid from "@mui/material/Grid";
import homesvg from "./homesvg.jpg";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { FormControlLabel, Switch } from "@mui/material";
import { entities } from "../constants/files/entities";

function HomeInput() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    entity: "",
    id: "",
    reverse: false,
  });

  const handleFormEntityInput = (e) => {
    setFormData({ ...formData, entity: e.target.value });
  };

  const handleFormIdInput = (e) => {
    setFormData({ ...formData, id: e.target.value });
  };

  const handleFormCheckInput = (e) => {
    setFormData({ ...formData, reverse: e.target.checked });
  };

  const handleSubmit = () => {
    if (formData.entity == "" || formData.id == "") {
      setEmptyAlert(true);
    } else {
      navigate(
        `/graph/${formData.entity}/${formData.id}?reverse=${formData.reverse}`
      );
    }
  };

  const [emptyAlert, setEmptyAlert] = React.useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setEmptyAlert(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackbarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <CenteredContainer>
      <Snackbar
        open={emptyAlert}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        action={action}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Enter All The Fields...
        </Alert>
      </Snackbar>
      <TitleText sx={{ fontSize: "clamp(1.5rem, 4vw, 10rem)" }}>
        Material&nbsp;Movement
      </TitleText>
      <TitleText2 sx={{ fontSize: "clamp(1.2rem, 3.5vw, 9rem)" }}>
        Visualization
      </TitleText2>
      <FormCard>
        <FormGridContainer container spacing={2}>
          <Grid item xs={12} sm={6} sx={{ height: "100%" }}>
            <FormCardContent sx={{ padding: { lg: " 0 60px" } }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "clamp(1rem, 3vw, 2rem)",
                  marginBottom: "10px",
                }}
              >
                Enter Details:
              </Typography>
              <FormControlStyled>
                <InputLabel
                  id="demo-simple-select-label"
                  sx={{
                    "&.Mui-focused": {
                      color: "#4CAF50", // Change label color to green when focused
                    },
                  }}
                >
                  Entity:
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={formData.entity}
                  label="Entity"
                  onChange={handleFormEntityInput}
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4CAF50", // Change the border color to green when focused
                    },
                  }}
                >
                  {Object.keys(entities).map((entity, index) => (
                    <MenuItem key={index} value={entity}>
                      {entity}
                    </MenuItem>
                  ))}
                </Select>

                <FormInput
                  label="ID"
                  variant="outlined"
                  value={formData.id}
                  onChange={handleFormIdInput}
                />
              </FormControlStyled>
              <FormControlLabel
                control={<Switch />}
                label="Reverse"
                value={formData.reverse}
                onChange={handleFormCheckInput}
              />

              <FormSubmitBtn variant="contained" onClick={handleSubmit}>
                <AlignVerticalCenterIcon /> Visualize
              </FormSubmitBtn>
            </FormCardContent>
          </Grid>
          <Grid item sm={6} sx={{ display: { xs: "none", sm: "block" } }}>
            <ImageContainer>
              <Image src={homesvg} alt="homesvg" />
            </ImageContainer>
          </Grid>
        </FormGridContainer>
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
  // paddingTop: "20vh",
});

const TitleText = styled(Typography)({
  textTransform: "uppercase",
  textAlign: "center",
  letterSpacing: 2,
  color: "#ff4d00",
  fontFamily: `"Questrial", sans-serif !important`,
});

const TitleText2 = styled(Typography)({
  paddingTop: "none",
  textTransform: "uppercase",
  marginBottom: 20,
  textAlign: "center",
  color: "#00A300",
  fontSize: "3vw",
  fontFamily: `"Questrial", sans-serif !important`,
});

const FormCard = styled(Card)({
  padding: 20,
  minHeight: 300,

  minWidth: 350,
});

const FormGridContainer = styled(Grid)({
  height: "100%",
  // display: "flex",
  // flexDirection: "column",
});

const FormCardContent = styled(CardContent)({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  // alignItems: "center",
  justifyContent: "space-around",
});

const FormControlStyled = styled(FormControl)({
  display: "flex",
  gap: 20,
});

const FormInput = styled(TextField)({
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#4CAF50", // Set label color to green when focused
    },
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#4CAF50", // Change the border color to green when focused
    },
  },
});

const FormSubmitBtn = styled(Button)({
  marginTop: 10,
  background: "#00A300",
  "&:hover": {
    background: "#008000",
  },
});

const ImageContainer = styled("div")({
  width: "100%",
});

const Image = styled("img")({
  width: "100%",
  objectFit: "contain",
});

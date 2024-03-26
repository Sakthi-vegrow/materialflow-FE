import React, { useEffect, useState } from "react";
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
import { Box, FormControlLabel, Switch } from "@mui/material";
import { entities } from "../constants/files/entities";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import "./HomeInput.css";
import PropTypes from "prop-types";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { validateEmail } from "./DagreAutoLayout/helpers/emailValidator";
import axios from "axios";
import { URL } from "../../env";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import { convertJsonToNodesAndEdges } from "../constants/files/nodeTransformer";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        height: "100%",
      }}
    >
      {value === index && (
        <Box
          sx={{
            height: "100%",
            display: "grid",
          }}
        >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function HomeInput() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    setTabValue(0);
  }, []);

  const defaultFormData = {
    entity: "",
    id: "",
    reverse: false,
  };

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    setFormData(defaultFormData);
  }, [tabValue]);

  const handleFormEntityInput = (e) => {
    setFormData({ ...formData, entity: e.target.value });
  };

  const handleFormIdInput = (e) => {
    setFormData({ ...formData, id: e.target.value });
  };

  const handleFormCheckInput = (e) => {
    setFormData({ ...formData, reverse: !formData.reverse });
  };

  const handleSubmit = () => {
    if (tabValue == 0) {
      if (formData.entity == "" || formData.id == "") {
        setEmptyAlert(true);
      } else {
        navigate(
          `/graph/${formData.entity}/${formData.id}?reverse=${formData.reverse}`
        );
      }
    } else if (tabValue == 1) {
      if (formData.entity == "" || formData.id == "") {
        setEmptyAlert(true);
      } else {
        navigate(
          `/graph/${formData.entity}/${formData.id}?reverse=${formData.reverse}&fetchleaf=true`
        );
      }
    } else if (tabValue == 2) {
      if (email == "" || !validateEmail(email) || selectedFile == null) {
        setEmptyAlert(true);
      } else {
        axios
          .post(URL + `material_flow/get_endpoints.json`, {
            headers: { "ngrok-skip-browser-warning": true },
            csv_data: jsonData,
            reverse: formData.reverse,
            email: email,
          })
          .then((data) => {
            setEmptyAlert(true);
            setCsvApiSuccess(true);
          })
          .catch(console.log);
      }
    }
  };

  const [emptyAlert, setEmptyAlert] = React.useState(false);
  const [csvApiSuccess, setCsvApiSuccess] = useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setEmptyAlert(false);
    setCsvApiSuccess(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const [email, setEmail] = useState("");

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);

  const convertCsvtoJson = (csvContent) => {
    const lines = csvContent.split(/\r?\n/); // Handle both \n and \r\n line endings
    const headers = lines[0].split(",");
    console.log("LINES: ", lines);
    console.log("HEADERS: ", headers);
    const data = lines.slice(1).map((line) => {
      const values = line.split(",");
      return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index] ? values[index].trim() : ""; // Handle empty values
        return obj;
      }, {});
    });

    return data;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const jsonOutput = convertCsvtoJson(content);
        console.log("JSON OUTPUT: ", jsonOutput);
        setJsonData(jsonOutput);
      };
      reader.readAsText(file);
    }
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
        {csvApiSuccess ? (
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Report will be sent to mail
          </Alert>
        ) : (
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Enter All The Fields...
          </Alert>
        )}
      </Snackbar>
      <TitleText sx={{ fontSize: "clamp(1.5rem, 4vw, 10rem)" }}>
        Material&nbsp;Movement
      </TitleText>
      <TitleText2 sx={{ fontSize: "clamp(1.2rem, 3.5vw, 9rem)" }}>
        Visualization
      </TitleText2>
      <FormCard sx={{ paddingBottom: { xs: 5, sm: 2 } }}>
        <FormGridContainer container spacing={2}>
          <Grid item xs={12} sm={6} sx={{ height: "100%" }}>
            <TabContainer>
              <Tabs
                scrollButtons
                onChange={handleTabChange}
                aria-label="Tabs"
                centered
                value={tabValue}
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#00A300",
                  },
                }}
              >
                <Tab
                  sx={{
                    fontSize: {
                      xs: "clamp(0.8rem, 1vw, 1.2rem)",
                      sm: "1.8vw",
                      lg: "1.3vw",
                      xl: "2vw",
                      color: "#00A300 !important",
                    },
                  }}
                  label="Full Trace"
                  {...a11yProps(0)}
                  value={0}
                />
                <Tab
                  sx={{
                    fontSize: {
                      xs: "clamp(0.8rem, 1vw, 1.2rem)",
                      sm: "1.8vw",
                      lg: "1.3vw",
                      xl: "2vw",
                      color: "#00A300 !important",
                    },
                  }}
                  label="End Points"
                  {...a11yProps(1)}
                  value={1}
                />
                <Tab
                  sx={{
                    fontSize: {
                      xs: "clamp(0.8rem, 1vw, 1.2rem)",
                      sm: "1.8vw",
                      lg: "1.3vw",
                      xl: "2vw",
                      color: "#00A300 !important",
                    },
                  }}
                  label="Bulk Report"
                  {...a11yProps(2)}
                  value={2}
                />
              </Tabs>
              <CustomTabPanel value={tabValue} index={0}>
                <FormCardContent
                  sx={{
                    padding: { lg: " 0 60px" },
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <div></div>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: "clamp(1rem, 2vw, 1.5rem)",
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
                    control={
                      <>
                        PO
                        <ArrowRightAltIcon
                          style={{
                            background: "#00A300",
                            color: "white",
                            borderRadius: "50%",
                            padding: 2,
                            marginLeft: 10,
                            marginRight: 10,
                            transform: `${
                              formData.reverse
                                ? "rotate(-180deg)"
                                : "rotate(0deg)"
                            }`,
                            transition: "all 0.2s ease-in",
                          }}
                          onClick={handleFormCheckInput}
                        />
                        SO
                      </>
                    }
                    value={formData.reverse}
                    onClick={handleFormCheckInput}
                    sx={{ display: "flex", justifyContent: "center" }}
                  />

                  <FormSubmitBtn variant="contained" onClick={handleSubmit}>
                    <AlignVerticalCenterIcon /> Visualize
                  </FormSubmitBtn>
                </FormCardContent>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={1}>
                <FormCardContent
                  sx={{
                    padding: { lg: " 0 60px" },
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <div></div>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: "clamp(1rem, 2vw, 1.5rem)",
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
                    control={
                      <>
                        PO
                        <ArrowRightAltIcon
                          style={{
                            background: "#00A300",
                            color: "white",
                            borderRadius: "50%",
                            padding: 2,
                            marginLeft: 10,
                            marginRight: 10,
                            transform: `${
                              formData.reverse
                                ? "rotate(-180deg)"
                                : "rotate(0deg)"
                            }`,
                            transition: "all 0.2s ease-in",
                          }}
                          onClick={handleFormCheckInput}
                        />
                        SO
                      </>
                    }
                    value={formData.reverse}
                    onChange={handleFormCheckInput}
                    sx={{ display: "flex", justifyContent: "center" }}
                  />

                  <FormSubmitBtn variant="contained" onClick={handleSubmit}>
                    <AlignVerticalCenterIcon /> Visualize
                  </FormSubmitBtn>
                </FormCardContent>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2}>
                <FormCardContent
                  sx={{
                    padding: { lg: " 0 60px" },
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <div></div>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: "clamp(1rem, 2vw, 1.5rem)",
                    }}
                  >
                    Enter Details:
                  </Typography>
                  <TextField
                    type="email"
                    variant="outlined"
                    placeholder="Enter EmailID"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#4CAF50", // Change border color on hover
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#4CAF50", // Change border color when focused
                        },
                      },
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {selectedFile && (
                    <ul
                      style={{
                        textAlign: "center",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        listStyle: "none",
                        gap: 5,
                      }}
                    >
                      <li
                        style={{
                          display: "flex",
                          alignItems: "center",
                          maxWidth: "50%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedFile.name}
                      </li>
                      <li style={{ display: "flex", alignItems: "center" }}>
                        <CloseOutlinedIcon
                          sx={{ color: "red", cursor: "pointer" }}
                          onClick={(e) => setSelectedFile(null)}
                        />
                      </li>
                    </ul>
                  )}

                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      background: "#00A300",
                      "&:hover": {
                        background: "#008000",
                      },
                    }}
                    onChange={handleFileChange}
                    disabled={selectedFile ? true : false}
                  >
                    {selectedFile ? "File Uploaded" : "Upload file"}
                    <VisuallyHiddenInput type="file" accept=".csv" />
                  </Button>
                  <FormControlLabel
                    control={
                      <>
                        PO
                        <ArrowRightAltIcon
                          style={{
                            background: "#00A300",
                            color: "white",
                            borderRadius: "50%",
                            padding: 2,
                            marginLeft: 10,
                            marginRight: 10,
                            transform: `${
                              formData.reverse
                                ? "rotate(-180deg)"
                                : "rotate(0deg)"
                            }`,
                            transition: "all 0.2s ease-in",
                          }}
                          onClick={handleFormCheckInput}
                        />
                        SO
                      </>
                    }
                    value={formData.reverse}
                    onClick={handleFormCheckInput}
                    sx={{ display: "flex", justifyContent: "center" }}
                  />
                  <FormSubmitBtn variant="contained" onClick={handleSubmit}>
                    <DocumentScannerOutlinedIcon sx={{ marginRight: 1 }} /> Get
                    Report
                  </FormSubmitBtn>
                </FormCardContent>
              </CustomTabPanel>
            </TabContainer>
          </Grid>
          <Grid
            item
            sm={6}
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
            }}
          >
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

const TabContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  // justifyContent: "center",
  height: "100%",
});

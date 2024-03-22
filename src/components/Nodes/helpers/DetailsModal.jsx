import Modal from "@mui/material/Modal";
import { Grid, Paper } from "@mui/material";
import styled from "styled-components";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function BasicModal({ open, setOpen, data }) {
  //   const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {Object.keys(data?.details).map((key) => {
          return (
            <Grid container spacing={2} key={key}>
              <Grid item xs={4}>
                <Item>{capitalizeFirstLetter(key)} :</Item>
              </Grid>
              <Grid item xs={4}>
                <Item>{data?.details[key]}</Item>
              </Grid>
            </Grid>
          );
        })}
      </Modal>
    </div>
  );
}

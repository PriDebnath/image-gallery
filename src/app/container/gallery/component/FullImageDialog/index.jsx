import * as React from "react";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Zoom from "@mui/material/Zoom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom ref={ref} {...props} />;
});

export default function FullImageDialog(props) {
  const { open, setOpen, src, alt, user } = props;
  console.log(alt);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        sx={{
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <AppBar sx={{ position: "fixed", backgroundColor: "rgba(0,0,0,0.3)" }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{ textAlign: "center", width: "90%" }}
              variant="h6"
              component="div"
            >
              {alt} capture by {user}
            </Typography>
            <IconButton
              component="div"
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="w-full py-[20%]  md:px-[10%] md:py-0  bg-[rgba(0,0,0,0.3)] h-[100vh] flex justify-center items-center">
          <img className="block" src={src} alt={alt} />
        </div>
      </Dialog>
    </div>
  );
}

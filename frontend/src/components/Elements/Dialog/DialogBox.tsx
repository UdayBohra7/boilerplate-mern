import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Button } from "..";
import clsx from "clsx";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    borderRadius: "0.5rem",
  },
  "& .MuiBackdrop-root.MuiModal-backdrop": {
    backgroundColor: "rgba(107, 114, 128)",
    opacity: "0.75 !important",
  },
}));

const footerPositions = {
  center: "justify-content-center",
  right: "justify-content-end",
  left: "justify-content-start",
};

export type DialogProps = {
  fullScreen?: boolean;
  triggerButton?: React.ReactElement;
  confirmButton?: React.ReactElement;
  title?: string;
  footerBtnPosition?: keyof typeof footerPositions;
};

export const DialogBox = ({
  fullScreen = false,
  triggerButton,
  confirmButton,
  title,
  footerBtnPosition = "center",
}: DialogProps): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {triggerButton ? (
        <span onClick={handleClickOpen}> {triggerButton}</span>
      ) : (
        <Button onClick={handleClickOpen}>Open dialog</Button>
      )}
      <BootstrapDialog
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        sx={{
          borderRadius: "0.5rem",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          {title && <h2 className="text-center my-4">{title}</h2>}

          <Typography gutterBottom>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros.
          </Typography>
          <div
            className={clsx(
              "footer-btn-area d-flex gap-2",
              footerPositions[footerBtnPosition]
            )}
          >
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {confirmButton ? (
              confirmButton
            ) : (
              <Button onClick={handleClose}>Save changes</Button>
            )}
          </div>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

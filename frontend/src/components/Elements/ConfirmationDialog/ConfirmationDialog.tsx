import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import { Button } from "..";
import clsx from "clsx";

export type ConfirmationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  status?: "danger" | "info" | "warning";
};

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  status = "danger",
}: ConfirmationDialogProps): React.ReactElement => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
          padding: "16px",
          maxWidth: "400px",
          width: "100%",
        },
      }}
    >
      <DialogContent className="text-center p-3">
        <div
          className="mb-3 mx-auto d-flex align-items-center justify-content-center"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background:
              status === "danger"
                ? "rgba(255, 77, 79, 0.1)"
                : "rgba(52, 152, 219, 0.1)",
            color: status === "danger" ? "#FF4D4F" : "#3498DB",
          }}
        >
          <i
            className={clsx(
              "fa-solid",
              status === "danger"
                ? "fa-triangle-exclamation"
                : "fa-circle-info",
              "fs-4"
            )}
          ></i>
        </div>

        <Typography variant="h6" className="fw-bold mb-2">
          {title}
        </Typography>

        {description && (
          <Typography variant="body2" color="text.secondary" className="mb-4">
            {description}
          </Typography>
        )}

        <div className="d-flex gap-2 justify-content-center mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-grow-1"
            style={{ borderRadius: "8px" }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={clsx("flex-grow-1", status === "danger" && "bg-danger")}
            style={{
              borderRadius: "8px",
              background: status === "danger" ? "#FF4D4F" : undefined,
              borderColor: status === "danger" ? "#FF4D4F" : undefined,
            }}
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
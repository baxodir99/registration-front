import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface ResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetDialog: React.FC<ResetDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-description"
    >
      <DialogTitle id="reset-dialog-title">Ma'lumotlarni tozalash</DialogTitle>
      <DialogContent>
        <DialogContentText id="reset-dialog-description">
          Barcha kiritilgan ma'lumotlar o'chiriladi va ro'yxatdan o'tish jarayoni qaytadan
          boshlanadi. Davom etishni xohlaysizmi?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Bekor qilish
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Tozalash
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetDialog;

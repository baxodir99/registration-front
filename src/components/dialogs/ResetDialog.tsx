import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ResetDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetDialog: React.FC<ResetDialogProps> = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-description"
    >
      <DialogTitle id="reset-dialog-title">{t('reset_dialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="reset-dialog-description">
          {t('reset_dialog.body')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {t('reset_dialog.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetDialog;

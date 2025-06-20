// @ts-nocheck
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

export default function Popup({ open, onClose, title, children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{ sx: { width: { xs: '90%', md: '50%' } } }}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

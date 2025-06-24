// @ts-nocheck
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useEffect } from 'react';

export default function Popup({ open, onClose, title, children }) {
  useEffect(() => {
    const root = document.getElementById('__next');
    if (!root) return;
    if (open) {
      root.setAttribute('inert', '');
    } else {
      root.removeAttribute('inert');
    }
    return () => {
      root.removeAttribute('inert');
    };
  }, [open]);
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

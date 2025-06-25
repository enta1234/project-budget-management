import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

let externalHandler: (msg: string) => void = () => {};
export function registerErrorHandler(fn: (msg: string) => void) {
  externalHandler = fn;
}
export function triggerError(message: string) {
  externalHandler(message);
}

interface ErrorContextProps {
  showError: (message: string) => void;
}

const ErrorContext = createContext<ErrorContextProps>({
  showError: () => {},
});

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const showError = (msg: string) => {
    setMessage(msg);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    registerErrorHandler(showError);
    return () => {
      registerErrorHandler(() => {});
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ErrorContext.Provider>
  );
}

export function useError() {
  return useContext(ErrorContext);
}

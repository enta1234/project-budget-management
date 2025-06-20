import { createContext, useContext, useState, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

interface ToastOptions {
  severity?: AlertColor;
}

interface ToastContextProps {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  const showToast = (msg: string, options?: ToastOptions) => {
    setMessage(msg);
    setSeverity(options?.severity || 'success');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

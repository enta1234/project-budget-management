// @ts-nocheck
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingButton({ loading, children, ...props }) {
  return (
    <Button disabled={loading || props.disabled} {...props}>
      {loading && <CircularProgress size={16} sx={{ mr: 1 }} />}
      {children}
    </Button>
  );
}

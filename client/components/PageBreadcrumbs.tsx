import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';

export interface Crumb {
  label: string;
  href?: string;
}

export default function PageBreadcrumbs({ items }: { items: Crumb[] }) {
  const router = useRouter();
  if (items.length <= 1) {
    return null;
  }
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {items.map((item, idx) =>
        item.href ? (
          <Link
            key={idx}
            underline="hover"
            color="inherit"
            onClick={() => router.push(item.href!)}
            sx={{ cursor: 'pointer' }}
          >
            {item.label}
          </Link>
        ) : (
          <Typography key={idx} color="text.primary">
            {item.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  );
}

// @ts-nocheck
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
});

export default function BudgetTable({ data, onEdit, onDelete }) {
  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      sortable: false,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueGetter: (_value, row, _col, api) => {
        if (!api) return '';
        const index = api.current.getRowIndexRelativeToVisibleRows(row.id);
        return typeof index === 'number' ? index + 1 : '';
      },
    },
    { field: 'role', headerName: 'Role', flex: 1 },
    { field: 'level', headerName: 'Level', width: 130 },
    {
      field: 'count',
      headerName: 'Count',
      width: 100,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
    },
    {
      field: 'rate',
      headerName: 'Baht/MD',
      width: 120,
      type: 'number',
      headerAlign: 'right',
      align: 'right',
      valueFormatter: params => {
        const value = params?.value;
        return typeof value === 'number' ? currencyFormatter.format(value) : value;
      },
    },
    (onEdit || onDelete) && {
      field: 'actions',
      headerName: 'Action',
      width: 120,
      sortable: false,
      renderCell: params => (
        <Box>
          {onEdit && (
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton size="small" onClick={() => onDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ].filter(Boolean);

  return (
    <Paper>
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={row => row.id}
        autoHeight
        pageSize={25}
        rowsPerPageOptions={[25]}
        sx={{ width: '100%' }}
      />
    </Paper>
  );
}

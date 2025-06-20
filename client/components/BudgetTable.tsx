// @ts-nocheck
import { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';

export default function BudgetTable({ data, onEdit }) {
  const groups = data.reduce((acc, item) => {
    const list = acc[item.role] || [];
    list.push(item);
    acc[item.role] = list;
    return acc;
  }, {});

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }} />
            <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="right">
              Total Count
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groups).map(([role, rows]) => (
            <RoleRow key={role} role={role} rows={rows} onEdit={onEdit} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function RoleRow({ role, rows, onEdit }) {
  const [open, setOpen] = useState(false);
  const total = rows.reduce((sum, r) => sum + (r.count || 0), 0);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{role}</TableCell>
        <TableCell align="right">{total}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Level</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Count
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Baht/MD
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="right">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>{r.level}</TableCell>
                      <TableCell align="right">{r.count}</TableCell>
                      <TableCell align="right">{r.rate}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => onEdit(r)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

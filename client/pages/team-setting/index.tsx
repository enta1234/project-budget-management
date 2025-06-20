// @ts-nocheck
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { format, differenceInYears } from 'date-fns';
import { Layout, ResourceForm, Popup } from '../../components';
import { withAuth, useAuth } from '../../context/AuthContext';

function TeamSetting() {
  const { token } = useAuth();
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);

  async function loadData() {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get('/api/v1/resources', { headers });
    setResources(res.data);
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  const handleCreate = async data => {
    const headers = { Authorization: `Bearer ${token}` };
    await axios.post('/api/v1/resources', data, { headers });
    setOpen(false);
    loadData();
  };
  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      width: 70,
      sortable: false,
    },
    { field: 'name', headerName: 'Name', flex: 1 },
  ];
  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Team Setting
        </Typography>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}
        >
          <Typography variant="h5">Resources</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            New Resource
          </Button>
        </Box>
        <Paper>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>Service Year</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.position}</TableCell>
                  <TableCell>
                    {r.startDate
                      ? format(new Date(r.startDate), 'yyyy-MM-dd')
                      : ''}
                  </TableCell>
                  <TableCell>
                    {r.startDate
                      ? differenceInYears(new Date(), new Date(r.startDate))
                      : ''}
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Popup open={open} onClose={() => setOpen(false)} title="Add Resource">
          <ResourceForm onSubmit={handleCreate} />
        </Popup>
      </Container>
    </Layout>
  );
}

export default withAuth(TeamSetting);

import React, { useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import GetUser from '../../utils/GetUser.js';

export default function Users() {
  const { users: [users, setUsers] } = useContext(KPIStoreContext);
  const refreshData = () => {
    setUsers([]);
  }

  useEffect(() => {
    if(users.length === 0) {
      GetUser().then((results) => {
        setUsers(results.data)
      })
    }

    return (() => {
      localStorage.setItem('users', JSON.stringify(users))
    });
  }, [users, setUsers]);

  if(users.length === 0) {
    return <Loading width={'100%'} />;
  }

  return(
    <>
      <Tooltip title="Refresh Data" aria-label="Refresh Data">
        <Button variant="contained" onClick={refreshData}><RefreshIcon/></Button>
      </Tooltip>
      <Paper style={{marginBottom: '1rem'}}>
        <Table stickyHeader >
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Jira ID</TableCell>
              <TableCell>Position</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(row => (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Typography variant="subtitle1" component={Link} to={`/user/${row.id}`}>{row.name}</Typography>
                </TableCell>
                <TableCell>{row.jira_id}</TableCell>
                <TableCell>{row.position}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

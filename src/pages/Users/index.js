import React, { useEffect, useContext, useState } from 'react';
import { Link } from "react-router-dom";
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import GetUser from '../../utils/GetUser.js';
import StableSort, {getSorting} from '../../utils/StableSort';
import TeamMember from '../../components/TeamMember';

const headerTitle = [
  {title: '#', key: null},
  {title: 'Name', key: 'name'},
  {title: 'Jira ID', key: 'jira_id'},
  {title: 'Position', key: 'position'},
  {title: 'Team Member', key: null}
];

export default function Users() {
  const { users: [users, setUsers] } = useContext(KPIStoreContext);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
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

  const createSortHandler = (property) => (event)  => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
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
              {headerTitle.map((item, idx) => {
                let cellValue = '';
                if(item.key === null) {
                  cellValue = item.title
                } else {
                  cellValue = <TableSortLabel
                    active={item.key === orderBy}
                    direction={order}
                    onClick={createSortHandler(item.key)}
                  >
                    {item.title}
                  </TableSortLabel>
                }
                return <TableCell key={idx}>{cellValue}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {StableSort(users, getSorting(order, orderBy)).map(row => (
              <TableRow hover tabIndex={-1} key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>
                  <Typography variant="subtitle1" component={Link} to={`/user/${row.id}`}>{row.name}</Typography>
                </TableCell>
                <TableCell>{row.jira_id}</TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell><TeamMember {...row} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}

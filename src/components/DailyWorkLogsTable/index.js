import React, {useState} from 'react';
import { Link } from "react-router-dom";
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import StableSort, { getSorting } from '../../utils/StableSort';

const useStyles = makeStyles({
  dark_bg: {
    background: '#eaeaea'
  },
  is_today: {
    'font-weight': 'bold',
    'background': '#e4e9ff'
  },
  tableResponsive: {
    'overflow-x': 'auto',
    paddingBottom: '.5rem'
  },
});

export default function DailyWorkLogsTable({...props}) {
  const {targetDateRange, users, workLogs} = props;
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const createSortHandler = (property) => (event)  => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  return (
    <div className={classes.tableResponsive}>
      <Table stickyHeader >
        <TableHead>
          <TableRow style={{'whiteSpace': 'nowrap'}}>
            <TableCell>
              <TableSortLabel
                active={'name' === orderBy}
                direction={order}
                onClick={createSortHandler('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            {targetDateRange.map((date, idx) => {
              const isToday = (new Date(date)).toDateString() === (new Date()).toDateString() ? classes.is_today : '';
              const currentDay = (new Date(date)).getDay();
              const isWeekend =  currentDay === 6 || currentDay === 0 ? classes.dark_bg : '';
              return <TableCell key={idx} className={`${isWeekend} ${isToday}`}>{date}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {StableSort(users, getSorting(order, orderBy)).map((user, idx) =>
            <TableRow hover tabIndex={-1} key={idx}>
              <TableCell>
                <Typography variant="subtitle1" component={Link} to={`/user/${user.id}`}>{user.name}</Typography>
              </TableCell>
              {targetDateRange.map((date, dateIdx) => {
                let logtime = workLogs.filter((item) => item.date === date && item.jira_id === user.jira_id );
                let isToday = (new Date(date)).toDateString() === (new Date()).toDateString() ? classes.is_today : '';
                let currentDay = (new Date(date)).getDay();
                let isWeekend =  currentDay === 6 || currentDay === 0 ? classes.dark_bg : '';
                let totalTimeSpent = (() => {
                  if(!!logtime[0] && logtime[0].total_time_spent !== undefined) {
                    return logtime[0].total_time_spent
                  } else {
                    return <Skeleton variant="rect" height={20} />
                  }
                })()
                return <TableCell key={dateIdx} className={`${isWeekend} ${isToday}`} >{totalTimeSpent}</TableCell>
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

import React from 'react';
import { Link } from "react-router-dom";
import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles({
  dark_bg: {
    background: '#eaeaea'
  },
  is_today: {
    'font-weight': 'bold',
    'background': '#e4e9ff'
  }
});

export default function DailyWorkLogsTable({...props}) {
  const {targetDateRange, users, workLogs} = props;
  const classes = useStyles();
  const dateTitle = new Date(targetDateRange[0]).toDateString();
  return (
    <Paper style={{marginBottom: '1rem'}}>
      <Typography variant="h5" component="h5">{ dateTitle }</Typography>
      <Table stickyHeader >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {targetDateRange.map((date, idx) => {
              const isToday = (new Date(date)).toDateString() === (new Date()).toDateString() ? classes.is_today : '';
              const currentDay = (new Date(date)).getDay();
              const isWeekend =  currentDay === 6 || currentDay === 0 ? classes.dark_bg : '';
              return <TableCell key={idx} className={`${isWeekend} ${isToday}`}>{date}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, idx) =>
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
    </Paper>
  );
}

import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  dark_bg: {
    background: '#eaeaea'
  },
  is_today: {
    'font-weight': 'bold'
  }
});

export default function DailyWorkLogsTable({...props}) {
  const {targetDateRange, users, workLogs} = props;
  const classes = useStyles();
  return (
    <Paper style={{marginBottom: '1rem'}}>
      <Table stickyHeader >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            {targetDateRange.map((date, idx) => {
              return <TableCell key={idx}>{date}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, idx) =>
            <TableRow hover tabIndex={-1} key={idx}>
              <TableCell>{user.name}</TableCell>
              {targetDateRange.map((date, dateIdx) => {
                const logtime = workLogs.filter((item) => item.date === date && item.jira_id === user.jira_id );
                const isToday = (new Date(date)).toDateString() == (new Date()).toDateString() ? classes.is_today : '';
                const currentDay = (new Date(date)).getDay();
                const isWeekend =  currentDay === 6 || currentDay === 0 ? classes.dark_bg : '';
                return <TableCell key={dateIdx} className={`${isWeekend} ${isToday}`} >{logtime[0] ? logtime[0].total_time_spent : '-'}</TableCell>
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

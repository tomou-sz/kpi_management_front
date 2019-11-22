import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

export default function DailyWorkLogsTable({...props}) {
  const {targetDateRange, users, workLogs}= props
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
                const logtime = workLogs.filter((item) => item.date === date && item.jira_id === user.jira_id )
                return <TableCell key={dateIdx}>{logtime[0] ? logtime[0].total_time_spent : ''}</TableCell>
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

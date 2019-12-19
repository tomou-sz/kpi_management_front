import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import TicketLabel from './TicketLabel';

const useStyles = makeStyles({
  tableResponsive: {
    'overflow-x': 'auto',
    paddingBottom: '.5rem'
  },
  odd_bg: {
    background: '#f8faff'
  },
});

const columnsBoard = [
  'TO DO',
  'IN PROGRESS',
  'REVIEW',
  'READY FOR DEPLOY',
  'READY FOR BETA TEST',
  'READY FOR TEST',
  'BETA TEST DONE',
  'IN TESTING',
  'READY FOR RELEASE',
  'RELEASED',
  'BACKLOG'
];

export default function KanbanLayout({...props}) {
  const classes = useStyles();
  const {data, progressing} = props;
  const headerTitle = columnsBoard;

  const BodyData = function() {
    if(data === undefined || progressing) {
      return (
        <TableCell colSpan={headerTitle.length}>
          <Skeleton variant="rect" height={20} width="80%" style={{marginBottom: '0.5rem'}} />
          <Skeleton variant="rect" height={20} width="60%" />
        </TableCell>
      );
    } else if (data.length === 0) {
      return (
        <TableCell colSpan={headerTitle.length}>
          <Typography variant="subtitle1" component='p'>No Data</Typography>
        </TableCell>
      );
    } else {
      return headerTitle.map((row, idx) => {
        return (
        <TableCell key={idx} style={{verticalAlign: 'top'}} className={idx % 2 === 0 ? classes.odd_bg : ''}>
          {
            data.filter(item => item.status.name.toLowerCase() === row.toLowerCase())
            .map((ticket) => {
              return (
                <TicketLabel {...ticket} ticket_key={ticket.key} />
              )
            })
          }
          <div style={{width: '200px'}}></div>
        </TableCell>
        );
      });
    }
  }

  return(
    <>
      <div className={classes.tableResponsive}>
        <Table stickyHeader >
          <TableHead>
            <TableRow style={{whiteSpace: 'nowrap'}} >
              {headerTitle.map((item, idx) => {
                const total = data.filter(ticket => ticket.status.name.toLowerCase() === item.toLowerCase()).length;
                return <TableCell key={idx} className={idx % 2 === 0 ? classes.odd_bg : ''}>{`${item} (${total})`}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <BodyData/>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

KanbanLayout.defaultProps = {
  data: [],
  progressing: false,
  showAssignee: false,
  assigneeLink: true,
}

KanbanLayout.propTypes = {
  data: PropTypes.array.isRequired,
  progressing: PropTypes.bool,
  showAssignee: PropTypes.bool,
  assigneeLink: PropTypes.bool,
};

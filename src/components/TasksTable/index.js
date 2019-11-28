import React, { useState } from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import TimeFormat from '../../utils/TimeFormat';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  tableResponsive: {
    'overflow-x': 'auto',
    paddingBottom: '.5rem'
  }
});

const headerTitle = [
  {title: '#', key: null},
  {title: 'Key', key: 'key'},
  {title: 'Type', key: 'issuetype'},
  {title: 'Summary', key: 'summary'},
  {title: 'Status', key: 'status_key'},
  {title: 'Original Estimate', key: 'original_estimate_seconds'},
  {title: 'Time Spent', key: 'time_spent_seconds'},
  {title: 'Remaining Estimate', key: 'remaining_estimate_seconds'}
];

export default function TaskTable({...props}) {
  const classes = useStyles();
  const {data} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('key');
  const BodyData = function() {
    if(data === undefined || data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={headerTitle.length}>
            <Skeleton variant="rect" height={20} width="80%" style={{marginBottom: '0.5rem'}} />
            <Skeleton variant="rect" height={20} width="60%" />
          </TableCell>
        </TableRow>
      )
    } else {
      return stableSort(data, getSorting(order, orderBy)).map((row, idx) => {
        return (<TableRow key={idx} >
          <TableCell>{idx}</TableCell>
          <TableCell>
            <Typography
              variant="subtitle1"
              component='a'
              href={`https://jira.sezax-vt.jp/browse/${row.key}`}
              target='_blank'
            >
              {row.key}
            </Typography>
          </TableCell>
          <TableCell>{row.issuetype}</TableCell>
          <TableCell>{row.summary}</TableCell>
          <TableCell>{row.status_key}</TableCell>
          <TableCell style={{'whiteSpace': 'nowrap'}} >{TimeFormat(row.original_estimate_seconds)}</TableCell>
          <TableCell style={{'whiteSpace': 'nowrap'}} >{TimeFormat(row.time_spent_seconds)}</TableCell>
          <TableCell style={{'whiteSpace': 'nowrap'}} >{TimeFormat(row.remaining_estimate_seconds)}</TableCell>
        </TableRow>);
      })
    }
  }

  const createSortHandler = (property) => (event)  => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  }

  return(
    <div className={classes.tableResponsive}>
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
          <BodyData/>
        </TableBody>
      </Table>
    </div>
  );
}

TaskTable.propTypes = {
  data: PropTypes.array
};

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

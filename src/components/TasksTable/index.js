import React, { useState } from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TablePagination} from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import TimeFormat from '../../utils/TimeFormat';
import { makeStyles } from '@material-ui/core/styles';
import StableSort, {getSorting} from '../../utils/StableSort';

const useStyles = makeStyles({
  tableResponsive: {
    'overflow-x': 'auto',
    paddingBottom: '.5rem'
  },
  dark_bg: {
    background: '#fcfcfc'
  }
});

const headerTitle = [
  {title: 'Key', key: 'key'},
  {title: 'Type', key: 'issuetype'},
  {title: 'Summary', key: 'summary'},
  {title: 'Status', key: 'status_key'},
  {title: 'Original Estimate', key: 'original_estimate_seconds'},
  {title: 'Time Spent', key: 'time_spent_seconds'},
  {title: 'Remaining Estimate', key: 'remaining_estimate_seconds'}
];

const defaultRowsPerPage = [7, 50, 100, 500];

export default function TaskTable({...props}) {
  const classes = useStyles();
  const {data, progressing} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('key');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage[0]);

  const BodyData = function() {
    if(data === undefined || progressing) {
      return (
        <TableRow>
          <TableCell colSpan={headerTitle.length}>
            <Skeleton variant="rect" height={20} width="80%" style={{marginBottom: '0.5rem'}} />
            <Skeleton variant="rect" height={20} width="60%" />
          </TableCell>
        </TableRow>
      )
    } else if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={headerTitle.length}>
            <Typography variant="subtitle1" component='p'>No Data</Typography>
          </TableCell>
        </TableRow>
      )
    } else {
      return StableSort(data, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => {
        return (<TableRow key={idx} className={(row.time_spent_seconds > row.original_estimate_seconds) ? classes.dark_bg : ''}>
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
      <TablePagination
        rowsPerPageOptions={defaultRowsPerPage}
        component="div"
        count={data ? data.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

TaskTable.propTypes = {
  data: PropTypes.array.isRequired,
  progressing: PropTypes.bool
};

import React, { useState } from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TablePagination} from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import TimeFormat from '../../utils/TimeFormat';
import { makeStyles } from '@material-ui/core/styles';
import StableSort, {getSorting} from '../../utils/StableSort';
import DefaultConfig from '../../utils/DefaultConfig';
import TasksStatus from '../../components/TasksStatus/';
import TasksType from '../../components/TasksType/';
import UserInfo from '../UserInfo';
import TicketsLabel from '../../components/TicketsLabel';

const useStyles = makeStyles({
  tableResponsive: {
    'overflow-x': 'auto',
    paddingBottom: '.5rem'
  },
  dark_bg: {
    background: '#fcfcfc'
  }
});

const headerTitle_non_assignee = [
  {title: 'Key', key: 'key'},
  {title: 'Type', key: 'issuetype'},
  {title: 'Summary', key: 'summary'},
  {title: 'Status', key: 'status.name'},
  {title: 'Original Estimate', key: 'original_estimate_seconds'},
  {title: 'Time Spent', key: 'time_spent_seconds'},
  {title: 'Remaining Estimate', key: 'remaining_estimate_seconds'}
];

const headerTitle_with_assignee = [
  {title: 'Key', key: 'key'},
  {title: 'Type', key: 'issuetype'},
  {title: 'Summary', key: 'summary'},
  {title: 'Status', key: 'status.name'},
  {title: 'Original Estimate', key: 'original_estimate_seconds'},
  {title: 'Time Spent', key: 'time_spent_seconds'},
  {title: 'Remaining Estimate', key: 'remaining_estimate_seconds'},
  {title: 'Assignee', key: 'jira_id'},
];

export default function TableLayout({...props}) {
  const classes = useStyles();
  const {data, progressing, showAssignee, assigneeLink} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('key');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DefaultConfig.DEFAULT_ROWS_PER_PAGE[0]);
  const headerTitle = showAssignee ? headerTitle_with_assignee : headerTitle_non_assignee;

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
      return StableSort(data, getSorting(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, idx) => {
        const Assignee = () => {
          if(showAssignee) {
            return (
              <TableCell>
                {!!row.user_id ? <UserInfo {...row} id={row.user_id} useLink={assigneeLink}/> : ''}
              </TableCell>
            );
          }
          return false;
        }
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
          <TableCell>
            <TasksType>
              {row.issuetype}
            </TasksType>
          </TableCell>
          <TableCell>
            <TicketsLabel>{row.summary}</TicketsLabel>
          </TableCell>
          <TableCell>
            <TasksStatus>{row.status.name}</TasksStatus>
          </TableCell>
          <TableCell style={{'whiteSpace': 'nowrap'}} >{TimeFormat(row.original_estimate_seconds)}</TableCell>
          <TableCell style={{'whiteSpace': 'nowrap'}} >{TimeFormat(row.time_spent_seconds)}</TableCell>
          <TableCell style={{'whiteSpace': 'nowrap'}} >{TimeFormat(row.remaining_estimate_seconds)}</TableCell>
          <Assignee />
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
    <>
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
      <TablePagination
        rowsPerPageOptions={DefaultConfig.DEFAULT_ROWS_PER_PAGE}
        component="div"
        count={data ? data.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}

TableLayout.defaultProps = {
  data: [],
  progressing: false,
  showAssignee: false,
  assigneeLink: true,
}

TableLayout.propTypes = {
  data: PropTypes.array.isRequired,
  progressing: PropTypes.bool,
  showAssignee: PropTypes.bool,
  assigneeLink: PropTypes.bool,
};

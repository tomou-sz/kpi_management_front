import React, { useState } from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
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
  },
  top_header: {
    paddingTop: '5px',
    paddingBottom: '5px',
    borderTop: '1px solid rgba(224, 224, 224, 1)'
  }
});

const topHeaderTitle = [
  {title: 'ImageStore Sprint', colspan: 9},
  {title: 'Others', colspan: 1},
  {title: 'Total for Weeks', colspan: 1},
];

const headerTitle = [
  {title: 'Name', key: 'jira_id'},
  {title: 'Estimate', key: 'estimate_total', type: 'datetime'},
  {title: 'Done', key: 'done_tickets_estimate_total', type: 'datetime'},
  {title: 'Sprint Work Logs', key: 'sprint_work_logs_total', type: 'datetime'},
  {title: 'Carried Over', key: 'carried_over_logs_total', type: 'datetime'},
  {title: 'Do Over Total', key: 'do_over_logs_total', type: 'datetime'},
  {title: 'Total Work Logs', key: 'total_work_logs'},
  {title: 'Productivity', key: 'productivity'},
  {title: 'Review Total', key: 'review_time_spend_total', type: 'datetime'},
  {title: 'Work Logs Total', key: 'work_logs_total', type: 'datetime'},
  {title: 'Total for Weeks', key: 'total_for_weeks'},
];

export default function ProductiveTable({...props}) {
  const classes = useStyles();
  const {data, progressing} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('key');
  let tableData = undefined;
  if(!!data) {
    tableData = migrateData(data);
  }

  const BodyData = function() {
    if(tableData === undefined || progressing) {
      return (
        <TableRow>
          <TableCell colSpan={headerTitle.length}>
            <Skeleton variant="rect" height={20} width="80%" style={{marginBottom: '0.5rem'}} />
            <Skeleton variant="rect" height={20} width="60%" />
          </TableCell>
        </TableRow>
      )
    } else if (tableData.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={headerTitle.length}>
            <Typography variant="subtitle1" component='p'>No Data</Typography>
          </TableCell>
        </TableRow>
      )
    } else {
      return StableSort(tableData, getSorting(order, orderBy)).map((row, idx) => {
        return (<TableRow key={idx}>
          {headerTitle.map((item, headerIndex) => {
            return <TableCell key={headerIndex} >{item.type === 'datetime' ? TimeFormat(row[item.key]) : row[item.key]}</TableCell>
          })}
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
    <>
      <div className={classes.tableResponsive}>
        <Table stickyHeader >
          <TableHead>
            <TableRow>
              {topHeaderTitle.map((item, idx) => {
                return (
                  <TableCell key={idx}
                    align={item.colspan > 1 ? 'center' : 'left'}
                    colSpan={item.colspan}
                    className={classes.top_header}
                  >
                    {item.title}
                  </TableCell>

                );
              })}
            </TableRow>
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
                return <TableCell key={idx} style={{'whiteSpace': 'nowrap'}} >{cellValue}</TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <BodyData/>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

const migrateData = (data) => {
  return data.map((item) => {
    return {
      jira_id: item.jira_id,
      carried_over_logs_total: item.kpi.main.carried_over_logs_total,
      do_over_logs_total: item.kpi.main.do_over_logs_total,
      done_tickets_estimate_total: item.kpi.main.done_tickets_estimate_total,
      estimate_total: item.kpi.main.estimate_total,
      review_time_spend_total: item.kpi.main.review_time_spend_total,
      sprint_work_logs_total: item.kpi.main.sprint_work_logs_total,
      work_logs_total: item.kpi.others.work_logs_total,
      target_sprint_id: item.target_sprint_id,
      user_id: item.user_id,
    }
  })
}

ProductiveTable.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  progressing: PropTypes.bool
};

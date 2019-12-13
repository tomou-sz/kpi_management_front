import React, { useState } from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel} from '@material-ui/core';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import TimeFormat from '../../utils/TimeFormat';
import { makeStyles } from '@material-ui/core/styles';
import StableSort, {getSorting} from '../../utils/StableSort';
import UserInfo from '../../components/UserInfo';
import { calcProductivity } from '../../utils/GetProductivity';

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
  },
  sum_row: {
    backgroundColor: '#f9faff'
  },
  font_bold: {
    fontWeight: 'bold'
  }
});

const topHeaderTitle = [
  {title: 'ImageStore Sprint', colspan: 9},
  {title: 'Others', colspan: 1},
  {title: 'Total for Weeks', colspan: 1},
];

const headerTitle = [
  {title: 'Name', key: 'name', manualTableCell: true},
  {title: 'Estimate', key: 'estimate_total', type: 'datetime'},
  {title: 'Done', key: 'done_tickets_estimate_total', type: 'datetime'},
  {title: 'Sprint Work Logs', key: 'sprint_work_logs_total', type: 'datetime'},
  {title: 'Carried Over', key: 'carried_over_logs_total', type: 'datetime'},
  {title: 'Do Over Total', key: 'do_over_logs_total', type: 'datetime'},
  {title: 'Total Work Logs', key: 'total_work_logs', type: 'datetime'},
  {title: 'Productivity', key: 'productivity'},
  {title: 'Review Total', key: 'review_time_spend_total', type: 'datetime'},
  {title: 'Work Logs Total', key: 'others_work_log_total', type: 'datetime'},
  {title: 'Total for Weeks', key: 'total_for_weeks', type: 'datetime'},
];



export default function ProductiveTable({...props}) {
  const classes = useStyles();
  const {data, progressing} = props;
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  let tableData = undefined;
  if(!!data) {
    tableData = convertData(data);
  }

  const BodyData = () => {
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
          <TableCell
            style={{'whiteSpace': 'nowrap'}}
          >
            <UserInfo {...row}/>
          </TableCell>
          {headerTitle.map((item, headerIndex) => {
            if(item.manualTableCell) {
              return false
            }
            return (
              <TableCell
                key={headerIndex}
                style={{'whiteSpace': 'nowrap'}}
              >
                {item.type === 'datetime' ? TimeFormat(row[item.key]) : row[item.key]}
              </TableCell>
            );
          }).filter((item) => !!item)}
        </TableRow>);
      })
    }
  }

  const SumDataRow = () => {
    if(tableData === undefined || progressing || tableData.length === 0) {
      return false
    }
    return (
      <TableRow className={classes.sum_row}>
        <TableCell className={classes.font_bold}>Total</TableCell>
        {headerTitle.map((col, colIdx) => {
          let cellData = null;
          if(!!col.manualTableCell) {
            return false
          }
          if(col.key === 'productivity') {
            const totalKPI = tableData.map((item) => calcProductivity(item.done_tickets_estimate_total, item.total_work_logs)).reduce((total, currentValue) => total + currentValue)
            cellData = `${Math.ceil(totalKPI / tableData.length)}%`
          } else {
            const totalLogWork = tableData.map((item) => item[col.key]).reduce((total, currentValue) => total + currentValue);
            cellData = TimeFormat(totalLogWork);
          }
          return (
            <TableCell key={colIdx} className={classes.font_bold}>
              {cellData}
            </TableCell>
          );
        }).filter((item) => !!item)}
      </TableRow>
    );
  };

  const createSortHandler = (property) => ()  => {
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
            <SumDataRow/>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

const convertData = (data) => {
  return data.map((item) => {
    const mainProject = item.kpi.main;
    const othersProject = item.kpi.others;

    const returnedTarget = Object.assign(item, {
      carried_over_logs_total: mainProject.carried_over_logs_total,
      do_over_logs_total: mainProject.do_over_logs_total,
      done_tickets_estimate_total: mainProject.done_tickets_estimate_total,
      estimate_total: mainProject.estimate_total,
      review_time_spend_total: mainProject.review_time_spend_total,
      sprint_work_logs_total: mainProject.sprint_work_logs_total,
      others_work_log_total: othersProject.work_logs_total,
    });
    return returnedTarget
  })
}

ProductiveTable.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  progressing: PropTypes.bool
};

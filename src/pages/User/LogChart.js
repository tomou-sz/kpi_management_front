import React, {useContext, useEffect, useRef} from 'react';
import { Chart } from "react-google-charts";
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import {renderDateArray} from '../../utils/TimeFormat';
import { KPIStoreContext } from '../../contexts/KPIStore';
import Loading from '../../components/Loading';
import GetLogWork from '../../utils/GetLogWork';
import { CancelToken } from 'axios';

export default function LogChart({...props}) {
  const {jira_id} = props;
  const { workLogs: [workLogs, setWorkLogs] } = useContext(KPIStoreContext);
  const currentWeek = getChartDates();
  const myLogWorkDates = workLogs.filter((item) => item.jira_id === jira_id).map((item) => item.date);
  const noDataDates = currentWeek.filter((item) => myLogWorkDates.indexOf(item) === -1);
  const userLogWork = workLogs.filter((item) => item.jira_id === jira_id && currentWeek.indexOf(item.date) !== -1);
  const source = CancelToken.source();
  const componentIsMounted = useRef(true);

  useEffect(() => {
    if(noDataDates.length > 0) {
      const promises = noDataDates.map((item) => {
        return GetLogWork(jira_id, item, { cancelToken: source.token });
      })
      Promise.all(promises).then((results) => {
        if( componentIsMounted.current ) {
          setWorkLogs([...workLogs, ...results]);
        }
      });
    }
    return (() => {
      const cacheLogs = workLogs.filter((item) => {
        return item.total_time_spent !== undefined;
      });
      localStorage.setItem('workLogs', JSON.stringify(cacheLogs));
      source.cancel();
      componentIsMounted.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workLogs]);

  const ChartRender = () => {
    if(noDataDates.length === 0) {
      let chartData = userLogWork.sort((a,b) => a.date.localeCompare(b.date))
      .filter(removeWeekendDays)
      .map((item) => {
        const logWorkDate = new Date(item.date);
        logWorkDate.setHours(0,0,0,0)
        return [logWorkDate, item.total_time_spent];
      });

      // Add table header to worklog
      chartData.unshift(['x', 'worklog']);

      return (
        <Box p={1} width='100%' >
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={{
              hAxis: {
                title: 'Log Works Last 5 Days',
              },
              vAxis: {
                minValue: 0,
                maxValue: 15
              },
              chartArea: { width: '85%' },
              legend: 'none',
            }}
          />
        </Box>
      )
    } else {
      return <Loading width={300}/>
    }
  }

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap" m={0} p={0}>
      <ChartRender/>
    </Box>
  );
}

const removeWeekendDays = (item) => new Date(item.date).getDay() !== 6 && new Date(item.date).getDay() !== 0;

const getChartDates = () => {
  const currentDay = new Date();
  const last7Day = currentDay.setDate(currentDay.getDate() - 7);
  return renderDateArray(last7Day);
}

LogChart.propTypes = {
  jira_id: PropTypes.string.isRequired
};

import React, {useContext, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {renderDateArray} from '../../utils/TimeFormat';
import { KPIStoreContext } from '../../contexts/KPIStore';
import Loading from '../../components/Loading';
import GetLogWork from '../../utils/GetLogWork';

export default function LogChart({...props}) {
  const {jira_id} = props;
  const { workLogs: [workLogs, setWorkLogs] } = useContext(KPIStoreContext);
  const currentWeek = getChartDates();
  const myLogWorkDates = workLogs.filter((item) => item.jira_id === jira_id).map((item) => item.date);
  const noDataDates = currentWeek.filter((item) => myLogWorkDates.indexOf(item) === -1);
  const userLogWork = workLogs.filter((item) => item.jira_id === jira_id && currentWeek.indexOf(item.date) !== -1);

  useEffect(() => {
    if(noDataDates.length > 0) {
      const promises = noDataDates.map((item) => {
        return GetLogWork(jira_id, item)
      })
      Promise.all(promises).then((results) => {
        setWorkLogs([...workLogs, ...results]);
      });
    }
    return (() => {
      const cacheLogs = workLogs.filter((item) => {
        return item.total_time_spent !== undefined
      })
      localStorage.setItem('workLogs', JSON.stringify(cacheLogs));
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workLogs])

  const ChartRender = () => {
    if(noDataDates.length === 0) {
      const chartData = userLogWork.filter(removeWeekendDays)
      .map((item) => {
        item.worklog = item.total_time_spent;
        return item;
      }).sort((a,b) => a.date.localeCompare(b.date));

      return (
        <Box p={1} width='100%' marginLeft='-50px' >
          <ResponsiveContainer width='100%' height='100%' aspect={16/9} >
            <LineChart
              data={chartData}
              margin={{
                top: 10, right: 5, left: 5, bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="worklog" stroke="#2196f3" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )
    } else {
      return <Loading width={300}/>
    }
  }

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap" m={1} p={1}>
      <ChartRender/>
      <Box p={1} bgcolor="grey.300">
        <Typography variant="body2" component="p" color="textSecondary">Log Works Last 7 Days</Typography>
      </Box>
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
  jira_id: PropTypes.string
};

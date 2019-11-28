import React, {useContext} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {renderDateArray} from '../../utils/TimeFormat';
import { KPIStoreContext } from '../../contexts/KPIStore';

export default function LogChart({...props}) {
  const {jira_id} = props;
  const { workLogs: [workLogs] } = useContext(KPIStoreContext);
  const currentDay = new Date();
  const last7Day = currentDay.setDate(currentDay.getDate() - 7);
  const currentWeek = renderDateArray(last7Day);
  const userLogWork = workLogs.filter((item) => item.jira_id === jira_id && currentWeek.indexOf(item.date) !== -1);

  const chartData = userLogWork.filter((item) => new Date(item.date).getDay() !== 6 && new Date(item.date).getDay() !== 0)
  .map((item) => {
    item.worklog = item.total_time_spent;
    return item;
  }).sort((a,b) => a.date.localeCompare(b.date));

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap" m={1} p={1}>
      <Box p={1} marginLeft='-50px' >
        <LineChart
          width={320}
          height={180}
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
      </Box>
      <Box p={1} bgcolor="grey.300">
        <Typography variant="body2" component="p" color="textSecondary">Log Works Last 7 Days</Typography>
      </Box>
    </Box>

  );
}

LogChart.propTypes = {
  jira_id: PropTypes.string
};

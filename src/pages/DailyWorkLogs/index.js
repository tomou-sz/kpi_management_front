import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DailyWorkLogsTable from '../../components/DailyWorkLogsTable';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import GetUser from '../../utils/GetUser.js';

const DAYS_OF_WEEK = 7;

const getDate = function(day_later, currentDate) {
  if( currentDate === undefined || !currentDate ) {
    currentDate = new Date();
  }
  var date = new Date(currentDate);
  date.setDate(date.getDate() + day_later);
  var year  = date.getFullYear();
  var month = date.getMonth() + 1;
  var day   = ("0" + date.getDate()).slice(-2);
  return String(year) + "-" + String(month) + "-" + String(day);
};

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6:1);
  return new Date(d.setDate(diff));
}

const renderDateArray = function(currentDate) {
  if( currentDate === undefined || !currentDate ) {
    currentDate = new Date();
  }
  let dateArray = [];
  for (let i = 0; i < (DAYS_OF_WEEK); i++) {
    dateArray.push(getDate(i, currentDate))
  }
  dateArray.sort((a,b) => a.date > b.date)
  return dateArray;
}

const fetchLogWork = function(jiraID, date) {
  return axios.get(process.env.REACT_APP_SERVER_URL + '/daily_work_logs/get_work_log', {
    params: {
      jira_id: jiraID,
      date: date,
    }
  })
  .then((results) => {
    return results;
  })
}

export default function DailyWorkLogs() {
  const [currentDay, setCurrentDay] = useState(getMonday(new Date()));
  const dateArray = renderDateArray(currentDay);
  const [targetDateRange, setTargetDateRange] = useState(dateArray);
  const { workLogs: [workLogs, setWorkLogs],
    users: [users, setUsers] } = useContext(KPIStoreContext);

  useEffect(() => {
    if( workLogs.length == 0 && users.length > 0 && targetDateRange.length > 0 ) {
      let promises = [];
      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        for (let k = 0; k < targetDateRange.length; k++) {
          let date = targetDateRange[k];
          promises.push(fetchLogWork(user.jira_id, date))
        }
      }

      Promise.all(promises).then((results) => {
        let logs = results.map((result) => {
          return {
            jira_id: result.data.jira_id,
            date: result.config.params.date,
            total_time_spent: result.data.total_time_spent
          }
        })
        setWorkLogs(logs)
      });
    }
  }, [workLogs, targetDateRange, users])

  if( users.length === 0 || !dateArray || workLogs.length === 0 ) {
    if(users.length === 0) {
      GetUser().then((results) => {
        setUsers(results.data)
      })
    }
    return <Loading width={400} />
  }

  return (
    <>
      <Paper style={{marginBottom: '1rem'}}>
        <DailyWorkLogsTable targetDateRange={targetDateRange} users={users} workLogs={workLogs} />
      </Paper>
      <Button variant="contained" onClick={ () => {
        let newDate = new Date(currentDay);
        newDate.setDate(newDate.getDate() - DAYS_OF_WEEK);
        setCurrentDay(newDate)
        setTargetDateRange(renderDateArray(newDate))
      }}>Prev</Button>
      <Button variant="contained" onClick={ () => {
        let newDate = new Date()
        setCurrentDay(newDate)
        setTargetDateRange(renderDateArray(newDate))
      }}>Today</Button>
      <Button variant="contained" onClick={ () => {
        let newDate = new Date(currentDay);
        newDate.setDate(newDate.getDate() + DAYS_OF_WEEK);
        setCurrentDay(newDate)
        setTargetDateRange(renderDateArray(newDate))
      }}>Next</Button>
    </>
  );
};

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import DailyWorkLogsTable from '../../components/DailyWorkLogsTable';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import GetUser from '../../utils/GetUser.js';

const DAYS_OF_WEEK = 7;

export default function DailyWorkLogs() {
  const [currentDay, setCurrentDay] = useState(getMonday(new Date()));
  const dateArray = renderDateArray(currentDay);
  const [targetDateRange, setTargetDateRange] = useState(dateArray);
  const { workLogs: [workLogs, setWorkLogs],
    users: [users, setUsers] } = useContext(KPIStoreContext);
  const refreshData = () => {
    let dateArr = renderDateArray(dateFormat(currentDay));
    setWorkLogs(workLogs.filter((item) => dateArr.indexOf(item.date) === -1));
  };

  useEffect(() => {
    if( users.length > 0 && targetDateRange.length > 0 ) {
      let promises = [];
      let initLoadingWorkLogs = [];
      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        for (let k = 0; k < targetDateRange.length; k++) {
          let date = targetDateRange[k];
          let isInArray = workLogs.filter((item) => {
            return item.jira_id === user.jira_id && item.date === date
          })
          if( isInArray.length === 0 ) {
            initLoadingWorkLogs.push({
              jira_id: user.jira_id,
              date: date,
              total_time_spent: undefined
            });
            promises.push(fetchLogWork(user.jira_id, date));
          }
        }
      }

      if( promises.length > 0 ) {
        setWorkLogs([...workLogs, ...initLoadingWorkLogs]);
        Promise.all(promises).then((results) => {
          setWorkLogs([...workLogs, ...results]);
        });
      }
    }
    return (() => {
      const cacheLogs = workLogs.filter((item) => {
        return item.total_time_spent !== undefined
      })
      localStorage.setItem('workLogs', JSON.stringify(cacheLogs));
    })
  }, [targetDateRange, users, workLogs, setWorkLogs])

  if( users.length === 0 || !dateArray ) {
    if(users.length === 0) {
      GetUser().then((results) => {
        setUsers(results.data);
      })
    }
    return <Loading width={400} />
  }

  return (
    <>
      <Tooltip title="Refresh Data" aria-label="Refresh Data">
        <Button variant="contained" onClick={refreshData}><RefreshIcon/></Button>
      </Tooltip>
      <Paper style={{marginBottom: '1rem'}}>
        <DailyWorkLogsTable targetDateRange={targetDateRange} users={users} workLogs={workLogs || []} />
      </Paper>
      <Button variant="contained" onClick={ () => {
        let newDate = new Date(currentDay);
        newDate.setDate(newDate.getDate() - DAYS_OF_WEEK);
        setCurrentDay(newDate)
        setTargetDateRange(renderDateArray(newDate))
      }}>Prev</Button>
      <Button variant="contained" style={{margin: '0 1rem'}} onClick={ () => {
        let newDate = getMonday(new Date())
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

const dateFormat = function(date) {
  var year  = date.getFullYear();
  var month = date.getMonth() + 1;
  var day   = ("0" + date.getDate()).slice(-2);
  return String(year) + "-" + String(month) + "-" + String(day);
}

const getDate = function(day_later, currentDate) {
  if( currentDate === undefined || !currentDate ) {
    currentDate = new Date();
  }
  var date = new Date(currentDate);
  date.setDate(date.getDate() + day_later);
  return dateFormat(date);
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
    return {
      jira_id: results.data.jira_id,
      date: results.config.params.date,
      total_time_spent: results.data.total_time_spent
    }
  })
}

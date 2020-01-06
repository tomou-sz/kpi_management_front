import React, { useState, useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import DailyWorkLogsTable from '../../components/DailyWorkLogsTable';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore';
import GetUser from '../../utils/GetUser';
import GetLogWork from '../../utils/GetLogWork';
import {getMonday, dateFormat, renderDateArray} from '../../utils/TimeFormat';
import axios from 'axios';

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
            promises.push(GetLogWork(user.jira_id, date));
          }
        }
      }

      if( promises.length > 0 ) {
        setWorkLogs([...workLogs, ...initLoadingWorkLogs]);
        Promise.all(promises).then((results) => {
          setWorkLogs([...workLogs, ...results]);
        }).catch((e) => {
          if (!axios.isCancel(e)) {
            console.log("Error: ", e);
          }
        });
      }
    }
    return (() => {
      const cacheLogs = workLogs.filter((item) => {
        return item.total_time_spent !== undefined
      })
      localStorage.setItem('workLogs', JSON.stringify(cacheLogs));
    });
  }, [targetDateRange, users, workLogs, setWorkLogs])

  if( users.length === 0 || !dateArray ) {
    if(users.length === 0) {
      GetUser().then((results) => {
        setUsers(results.data);
      }).catch((e) => {
        if (!axios.isCancel(e)) {
          console.log("Error: ", e);
        }
      });
    }
    return <Loading width={400} />
  }

  return (
    <>
      <Tooltip title="Refresh Data" aria-label="Refresh Data">
        <Button variant="contained" onClick={refreshData}><RefreshIcon/></Button>
      </Tooltip>
      <Paper style={{marginBottom: '1rem'}}>
        <Typography variant="h5" component="h5">{ new Date(targetDateRange[0]).toDateString() }</Typography>
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

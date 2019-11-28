import React, { useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import { KPIStoreContext } from '../../contexts/KPIStore';
import NotFound from '../../components/NotFound';
import Loading from '../../components/Loading';
import ShowProfile from './ShowProfile';
import TasksSession from './TasksSession';

import LogChart from './LogChart';

const CURRENT_SPRINT_ID = 19;

export default function User() {
  const { id } = useParams();
  const [showTask, setShowTask] = useState(true);
  const { users: [users] } = useContext(KPIStoreContext);
  const user = users.filter((item) => item.id === Number(id))[0];

  const refreshData = () => {
    setShowTask(false);
    setTimeout(() => {setShowTask(true)}, 100)
  }

  if(user === undefined) {
    return <NotFound width={'100%'} />
  }

  return(
    <Grid container spacing={3}>
      <Grid item xs={9}>
        <Tooltip title="Refresh Data" aria-label="Refresh Data">
          <Button variant="contained" onClick={refreshData}><RefreshIcon/></Button>
        </Tooltip>
        {showTask ? <TasksSession userid={user.id} sprintID={CURRENT_SPRINT_ID} /> : <Loading width={'100%'} />}
      </Grid>
      <Grid item xs={3}>
        <ShowProfile {...user} sprintID={CURRENT_SPRINT_ID}/>
        <LogChart {...user} />
      </Grid>
    </Grid>
  );
}

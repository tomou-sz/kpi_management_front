import React, { useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import RefreshIcon from '@material-ui/icons/Refresh';
import { KPIStoreContext } from '../../contexts/KPIStore';
import NotFound from '../../components/NotFound';
import ShowProfile from './ShowProfile';
import TasksSession from './TasksSession';
import DefaultConfig from '../../utils/DefaultConfig';
import LogChart from './LogChart';

const sprintList = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 30];

export default function User() {
  const { id } = useParams();
  const [sprint, setSprint] = useState(DefaultConfig.CURRENT_SPRINT_ID);
  const [reloadComponent, setReloadComponent] = useState(0);
  const { users: [users] } = useContext(KPIStoreContext);
  const user = users.filter((item) => item.id === Number(id))[0];

  const refreshData = () => {
    setReloadComponent((new Date()).getTime());
  }

  if(user === undefined) {
    return <NotFound width={'100%'} />
  }

  const handleChange = name => event => {
    setSprint(parseInt(event.target.value))
  };

  return(
    <Grid container spacing={3}>
      <Grid item xs={9}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Tooltip title="Refresh Data" aria-label="Refresh Data">
              <Button variant="contained" onClick={refreshData}><RefreshIcon/></Button>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <div style={{textAlign: "right"}} >
              <Select
                native
                value={sprint}
                onChange={handleChange()}
              >
                {sprintList.map((item, idx) => {
                  return <option key={idx} value={item}>SPRINT: {item}</option>
                })}
              </Select>
            </div>
          </Grid>
        </Grid>
        {<TasksSession userid={user.id} sprintID={sprint} reload={reloadComponent} />}
      </Grid>
      <Grid item xs={3}>
        <ShowProfile {...user} sprintID={sprint}/>
        <LogChart {...user} />
      </Grid>
    </Grid>
  );
}

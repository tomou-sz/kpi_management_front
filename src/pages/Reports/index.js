import React, { useState, useContext, useEffect, useRef } from "react";
import { KPIStoreContext } from '../../contexts/KPIStore';
import DefaultConfig from '../../utils/DefaultConfig';
import { makeStyles, Grid, Paper, Tooltip, Button, Select } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SelectSprint from '../../components/SelectSprint';
import SelectTeam from '../../components/SelectTeam';
import GetUser from '../../utils/GetUser.js';
import BurndownChart from './BurndownChart';
import axios, { CancelToken } from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      padding: theme.spacing(1),
    },
    '& .btn-group > *': {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  },
}));

export default function Reports() {
  const classes = useStyles();
  const source = CancelToken.source();
  const [sprint, setSprint] = useState(-1);
  const [teamSelector, setTeamSelector] = useState(DefaultConfig.TEAM_LIST[0].name);
  const [reloadComponent, setReloadComponent] = useState(0);
  const prevReloadState = useRef(reloadComponent);
  const { users: [users, setUsers],
    boardSprints: [boardSprints] } = useContext(KPIStoreContext);
  const teamIds = users.filter(item => DefaultConfig[teamSelector].indexOf(item.jira_id) !== -1).map(item => item.id);
  const activeSprint = boardSprints.filter(item => item.id === sprint)[0];

  useEffect(() => {
    const isReload = prevReloadState.current !== reloadComponent;
    if(sprint === -1 && boardSprints.length !== 0) {
      setSprint(boardSprints.filter(item => item.state === 'active')[0].id);
    }

    if(users.length === 0) {
      GetUser({ cancelToken: source.token })
      .then((results) => {
        setUsers(results.data);
      }).catch((e) => {
        if (!axios.isCancel(e)) {
          console.log("Error: ", e);
        }
      });
    }

    if(isReload) {
      console.log('reload component');
    }

    prevReloadState.current = reloadComponent;
    return (() => {
      source.cancel();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSprints, sprint, teamSelector, reloadComponent]);

  const handleChangeSprint = () => event => {
    setSprint(parseInt(event.target.value));
  };

  const handleChangeTeamSelector = () => event => {
    setTeamSelector(event.target.value);
  };

  const refreshData = () => {
    setReloadComponent((new Date()).getTime());
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6} style={{display: 'flex'}} className='btn-group'>
          <Tooltip
            title="Refresh Data"
            aria-label="Refresh Data" >
            <Button variant="contained" onClick={ refreshData }>
              <RefreshIcon/>
            </Button>
          </Tooltip>
          <SelectTeam value={teamSelector} onChange={handleChangeTeamSelector()}/>
          <SelectSprint value={sprint} onChange={handleChangeSprint()}/>
        </Grid>
        <Grid item xs={6} style={{textAlign: 'right'}}>
          <Select native >
            {[
              {title: 'BurnDown Chart', value: 'burndown_chart'},
              {title: 'Velocity Chart', value: 'velocity_chart'}
            ].map((item, idx) => {
            return <option key={idx} value={item.value}>{item.title}</option>
            })}
          </Select>
        </Grid>
      </Grid>
      <Paper style={{marginBottom: '1rem'}}>
        {
          (sprint !== -1 && teamIds.length > 0) ?
          <BurndownChart
            user_ids={teamIds.join(',')}
            sprint_id={sprint.toString()}
            startDate={new Date(activeSprint.start_date)}
            endDate={new Date(activeSprint.end_date)}
          /> : ''
        }
      </Paper>
    </div>
  );
}

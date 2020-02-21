import React, { useState, useContext, useEffect } from "react";
import { KPIStoreContext } from '../../contexts/KPIStore';
import DefaultConfig from '../../utils/DefaultConfig';
import { makeStyles, Grid, Paper, Tooltip, Button, Select } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SelectSprint from '../../components/SelectSprint';
import SelectTeam from '../../components/SelectTeam';
import GetUser from '../../utils/GetUser.js';
import BurndownChart from './BurndownChart';
import VelocityChart from './VelocityChart';
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
  const [chartType, setChartType] = useState('burndown_chart');
  const [teamSelector, setTeamSelector] = useState(DefaultConfig.TEAM_LIST[0].name);
  const [reloadComponent, setReloadComponent] = useState(0);
  const { users: [users, setUsers],
    boardSprints: [boardSprints] } = useContext(KPIStoreContext);
  const teamIds = !!users && users.filter(item => DefaultConfig[teamSelector].indexOf(item.jira_id) !== -1).map(item => item.id);
  const activeSprint = !!boardSprints && boardSprints.filter(item => item.id === sprint)[0];

  useEffect(() => {
    if(sprint === -1 && boardSprints.length !== 0) {
      let actSprint = boardSprints.filter(item => item.state === 'active');
      if(actSprint.length > 0) {
        setSprint(actSprint[0].id);
      }
    }

    if(!!users && users.length === 0) {
      GetUser({ cancelToken: source.token })
      .then((results) => {
        setUsers(results.data);
      }).catch((e) => {
        if (!axios.isCancel(e)) {
          console.log("Error: ", e);
        }
      });
    }

    return (() => {
      source.cancel();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSprints, sprint, teamSelector]);

  const handleChangeSprint = () => event => {
    setSprint(parseInt(event.target.value));
  };

  const handleChangeTeamSelector = () => event => {
    setTeamSelector(event.target.value);
  };

  const handleChangeChart = () => event => {
    setChartType(event.target.value);
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
          <Select
            native
            onChange={handleChangeChart()}
            value={chartType}
          >
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
          chartType === 'burndown_chart' ?
          (
            (sprint !== -1 && teamIds.length > 0) ?
            <BurndownChart
              isReload={reloadComponent}
              user_ids={teamIds.join(',')}
              sprint_id={!!sprint && sprint.toString()}
              startDate={!!activeSprint && new Date(activeSprint.start_date)}
              endDate={!!activeSprint && new Date(activeSprint.end_date)}
            />
            : ''
          )
          : <VelocityChart/>
        }
      </Paper>
    </div>
  );
}

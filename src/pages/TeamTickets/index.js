import React, { useState, useContext, useEffect, useRef } from "react";
import { KPIStoreContext } from '../../contexts/KPIStore';
import DefaultConfig from '../../utils/DefaultConfig';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import Select from '@material-ui/core/Select';
import SelectSprint from '../../components/SelectSprint';
import GetSprints from '../../utils/GetSprints';
import TasksTable from '../../components/TasksTable';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import GetTasks, { IncludeUserInfo } from '../../utils/GetTasks.js';
import GetUser from '../../utils/GetUser.js';
import { CancelToken } from 'axios';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function TeamTickets() {
  const classes = useStyles();
  const source = CancelToken.source();
  const [loading, setLoading] = useState(true);
  const [sprint, setSprint] = useState(-1);
  const [teamSelector, setTeamSelector] = useState(DefaultConfig.TEAM_LIST[0].name);
  const [reloadComponent, setReloadComponent] = useState(0);
  const prevReloadState = useRef(reloadComponent);
  const { users: [users, setUsers],
    boardSprints: [boardSprints, setBoardSprints],
    tickets: [tickets, dispatchTickets] } = useContext(KPIStoreContext);
  const teamIds = users.filter(item => DefaultConfig[teamSelector].indexOf(item.jira_id) !== -1).map(item => item.id);
  const filterTask = tickets.filter(item => teamIds.indexOf(item.user_id) !== -1 &&
    item.sprint_ids.indexOf(sprint.toString()) !== -1 );

  useEffect(() => {
    const isReload = prevReloadState.current !== reloadComponent;
    if(boardSprints.length === 0) {
      GetSprints({ cancelToken: source.token })
      .then((results) => {
        setBoardSprints(results.data);
      });
    } else if(sprint === -1) {
      setSprint(boardSprints.filter((item) => item.state === 'active')[0].id);
    }

    if(users.length === 0) {
      GetUser({ cancelToken: source.token })
      .then((results) => {
        setUsers(results.data);
      });
    }

    if(filterTask.length === 0 && sprint !== -1 && !isReload) {
      setLoading(true);
      let promises = teamIds.map(item => {
        return GetTasks(item, sprint, { cancelToken: source.token }).then((results) => {
          return results.data;
        });
      });
      Promise.all(promises).then(results => {
        const tickets = [];
        for(var i = 0; i < results.length; i += 1) {
          const data = results[i];
          for(var j = 0; j < data.sprint_tickets.length; j += 1) {
            const item = data.sprint_tickets[j];
            const currentUser = users.filter(item => item.id === data.user_id);
            tickets.push(IncludeUserInfo(item, {user_id: data.user_id, jira_id: data.jira_id, position: currentUser[0].position}));
          }
        }
        if(tickets.length !== 0) {
          dispatchTickets({type: 'ADD_OR_UPDATE_TICKETS', data: tickets});
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }

    if(isReload) {
      dispatchTickets({type: 'REMOVE_TICKETS', filter: (item) => {
        if(teamIds.indexOf(item.user_id) !== -1) {
          return item.sprint_ids.indexOf(sprint.toString()) === -1;
        }
        return true;
      }});
    }

    prevReloadState.current = reloadComponent;
    return (() => {
      source.cancel();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, boardSprints, sprint, teamSelector, tickets, reloadComponent]);

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
      <Tooltip
        title="Refresh Data"
        aria-label="Refresh Data" >
        <Button variant="contained" onClick={ refreshData }>
          <RefreshIcon/>
        </Button>
      </Tooltip>
      <Select
        native
        value={teamSelector}
        onChange={handleChangeTeamSelector()}
      >
        {DefaultConfig.TEAM_LIST.map((item, idx) => {
        return <option key={idx} value={item.name}>{item.title}</option>
        })}
      </Select>
      <SelectSprint value={sprint} onChange={handleChangeSprint()}/>
      <Paper style={{marginBottom: '1rem'}}>
        <TasksTable progressing={loading} data={filterTask} showAssignee />
      </Paper>
    </div>
  );
}

import React, {useEffect, useContext, useState, useRef} from 'react';
import Paper from '@material-ui/core/Paper';
import TasksTable from '../../components/TasksTable';
import GetTasks, { IncludeUserInfo } from '../../utils/GetTasks.js';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';

export default function TasksSession({...props}) {
  const {jira_id, user_id, sprintID, reload, position} = props;
  const [loading, setLoading] = useState(true);
  const { tickets: [tickets, dispatchTickets] } = useContext(KPIStoreContext);
  const assignTickets = tickets.filter((item) => item.user_id === user_id && item.sprint_ids.indexOf(sprintID.toString()) !== -1);
  const source = CancelToken.source();
  const componentIsMounted = useRef(true);

  const fetchTasks = () => {
    setLoading(true);
    GetTasks(user_id, sprintID, { cancelToken: source.token }).then((results) => {
      const ticketsMap = results.data.sprint_tickets.map((item) => {
        return IncludeUserInfo(item, {user_id: user_id, jira_id: jira_id, position: position});
      });
      if(componentIsMounted.current) {
        dispatchTickets({type: 'ADD_OR_UPDATE_TICKETS', data: ticketsMap});
        setLoading(false);
      }
    })
    .finally(() => {
      if(componentIsMounted.current) {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    componentIsMounted.current = true;
    if(sprintID !== -1) {
      fetchTasks();
    }
    return (() => {
      source.cancel();
      componentIsMounted.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, reload]);

  useEffect(() => {
    if(assignTickets.length !== 0) {
      setLoading(false);
    } else if(sprintID !== -1) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintID]);

  return (
    <Paper style={{marginBottom: '1rem'}}>
      <TasksTable progressing={loading} data={assignTickets} showAssignee={false} />
    </Paper>
  );
}

TasksSession.propTypes = {
  user_id: PropTypes.number.isRequired,
  sprintID: PropTypes.number.isRequired,
  reload: PropTypes.number
};

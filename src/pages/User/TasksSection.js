import React, {useEffect, useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import TasksTable from '../../components/TasksTable';
import GetTasks from '../../utils/GetTasks.js';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';

export default function TasksSession({...props}) {
  const {userid, sprintID, reload} = props;
  const [loading, setLoading] = useState(true);
  const { tickets: [tickets, dispatchTickets] } = useContext(KPIStoreContext);
  const assignTickets = tickets.filter((item) => item.user_id === userid && item.sprint_ids.indexOf(sprintID.toString()) !== -1);
  const source = CancelToken.source();

  const fetchTasks = () => {
    setLoading(true)
    GetTasks(userid, sprintID, { cancelToken: source.token }).then((results) => {
      const ticketsMap = results.data.sprint_tickets.map((item) => {
        item.user_id = userid;
        return item;
      });
      dispatchTickets({type: 'ADD_OR_UPDATE_TICKETS', data: ticketsMap})
      setLoading(false);
    })
    .catch((error) => {
      // TODO: implement Snackbar component in the future
    })
    .finally(() => {
      setLoading(false)
    });
  };

  useEffect(() => {
    if(sprintID !== -1) {
      fetchTasks()
    }
    return (() => {
      source.cancel();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userid, reload]);

  useEffect(() => {
    if(assignTickets.length !== 0) {
      setLoading(false)
    } else if(sprintID !== -1) {
      fetchTasks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintID]);

  return (
    <Paper style={{marginBottom: '1rem'}}>
      <TasksTable progressing={loading} data={assignTickets} />
    </Paper>
  );
}

TasksSession.propTypes = {
  userid: PropTypes.number.isRequired,
  sprintID: PropTypes.number.isRequired,
  reload: PropTypes.number
};

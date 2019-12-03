import React, {useEffect, useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import TasksTable from '../../components/TasksTable';
import GetTasks from '../../utils/GetTasks.js';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import PropTypes from 'prop-types';

export default function TasksSession({...props}) {
  const {userid, sprintID, reload} = props;
  const [loading, setLoading] = useState(true);
  const { tickets: [tickets, setTickets] } = useContext(KPIStoreContext);
  const assignTickets = tickets.filter((item) => item.user_id === userid && item.sprint_ids.indexOf(sprintID.toString()) !== -1);

  const fetchTasks = () => {
    GetTasks(userid, sprintID).then((results) => {
      const keyList = results.data.sprint_tickets.map((item) => item.key);
      const ticketsMap = results.data.sprint_tickets.map((item) => {
        item.user_id = userid;
        return item;
      });
      const lastTickets = tickets.filter((item) => keyList.indexOf(item.key) === -1);
      setTickets([...lastTickets, ...ticketsMap])
      setLoading(false)
    })
    .catch((error) => {
      // TODO: implement Snackbar component in the future
    })
    .finally(() => {
      setLoading(false)
    });
  }

  useEffect(() => {
    // reset Loading State when Props(sprintID) change
    setLoading(true)
  }, [sprintID])

  useEffect(() => {
    // fetchTask when Props(reload) change
    setLoading(true)
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload])

  useEffect(() => {
    if(assignTickets.length !== 0) {
      setLoading(false)
    } else {
      fetchTasks()
    }
    return (() => {
      localStorage.setItem('tickets', JSON.stringify(tickets))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userid, sprintID])

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

import React, {useEffect, useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import TasksTable from '../../components/TasksTable';
import GetTasks from '../../utils/GetTasks.js';
import { KPIStoreContext } from '../../contexts/KPIStore.js';
import PropTypes from 'prop-types';

export default function TasksSession({...props}) {
  const {userid, sprintID} = props;
  const { tickets: [tickets, setTickets] } = useContext(KPIStoreContext);
  const fetchTasks = () => {
    GetTasks(userid, sprintID).then((results) => {
      const ticketsMap = results.data.sprint_tickets.map((item) => {
        item.sprint_id = sprintID;
        item.user_id = userid;
        return item;
      })
      const lastTickets = tickets.filter((item) => item.sprint_id === sprintID && item.user_id !== userid);
      setTickets([...lastTickets, ...ticketsMap])
    })
  }

  useEffect(() => {
    fetchTasks()
    return (() => {
      localStorage.setItem('tickets', JSON.stringify(tickets))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userid])

  const assignTickets = tickets.filter((item) => item.user_id === userid && item.sprint_id === sprintID);
  return (
    <Paper style={{marginBottom: '1rem'}}>
      <TasksTable data={assignTickets} />
    </Paper>
  );
}

TasksSession.propTypes = {
  userid: PropTypes.number,
  sprintID: PropTypes.number
};

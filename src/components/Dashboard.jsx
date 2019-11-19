import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List'

class Dashboard extends React.Component {
  render() {
    return (
      <List>
        <div className='app-main'>
          <Link to="/daily_work_logs">Go To Daily Work Logs</Link>
          <br />
          <Link to="/users">Go to User List</Link>
        </div>
      </List>
    );
  }
}

export default Dashboard;

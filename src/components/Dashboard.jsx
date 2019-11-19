import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';

class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
          </Toolbar>
        </AppBar>
        <div>
          <Divider />
          <List>
            <ListItem button key='daily_work_logs'>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <Link to="/daily_work_logs">Daily Work Logs</Link>
            </ListItem>
            <ListItem button key='users'>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <Link to="/users">Users List</Link>
            </ListItem>
          </List>
          <Divider />
        </div>
      </div>
    );
  }
}

export default Dashboard;

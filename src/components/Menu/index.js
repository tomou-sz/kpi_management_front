import React from 'react';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import TimelineIcon from '@material-ui/icons/Timeline';
import ListAltIcon from '@material-ui/icons/ListAlt';
import BarChartIcon from '@material-ui/icons/BarChart';

export default function Menu({...rest}) {
  return (
    <List>
      <ListItem button component={Link} to="/" selected={rest.title === 'Dashboard'} >
        <ListItemIcon><AssessmentIcon /></ListItemIcon>
        Dashboard
      </ListItem>
      <ListItem button component={Link} to="/users" selected={['Member List', 'Member'].indexOf(rest.title) !== -1}>
        <ListItemIcon><PeopleIcon /></ListItemIcon>
        Users List
      </ListItem>
      <ListItem button component={Link} to="/daily_work_logs" selected={rest.title === 'Daily Work Logs'} >
        <ListItemIcon><AssignmentIcon /></ListItemIcon>
        Daily Work Logs
      </ListItem>
      <ListItem button component={Link} to="/productivities" selected={rest.title === 'Productivities'} >
        <ListItemIcon><TimelineIcon /></ListItemIcon>
        Productivities
      </ListItem>
      <ListItem button component={Link} to="/team_tickets" selected={rest.title === 'Team Tickets'} >
        <ListItemIcon><ListAltIcon /></ListItemIcon>
        Team Tickets
      </ListItem>
      <ListItem button component={Link} to="/reports" selected={rest.title === 'Reports'} >
        <ListItemIcon><BarChartIcon /></ListItemIcon>
        Reports
      </ListItem>
    </List>
  );
}

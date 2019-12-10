import React from 'react';
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleIcon from '@material-ui/icons/People';
import TimelineIcon from '@material-ui/icons/Timeline';

export default function Menu() {
  return (
    <List>
      <ListItem button component={Link} to="/">
        <ListItemIcon><AssessmentIcon /></ListItemIcon>
        Dashboard
      </ListItem>
      <ListItem button component={Link} to="/users">
        <ListItemIcon><PeopleIcon /></ListItemIcon>
        Users List
      </ListItem>
      <ListItem button component={Link} to="/daily_work_logs">
        <ListItemIcon><AssignmentIcon /></ListItemIcon>
        Daily Work Logs
      </ListItem>
      <ListItem button component={Link} to="/productivities">
        <ListItemIcon><TimelineIcon /></ListItemIcon>
        Productivities
      </ListItem>
    </List>
  );
}

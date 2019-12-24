import React from "react";
import TasksStatus from '../../components/TasksStatus/';
import TasksType from '../../components/TasksType/';
import {Card, CardActionArea, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import UserInfo from '../UserInfo';
import TicketsLabel from '../../components/TicketsLabel';

export default function TicketLabel({...props}) {
  const {ticket_key, status, summary, issuetype, user_id} = props;

  return (
    <Card style={{marginBottom: '1rem'}}>
      <CardActionArea>
        <CardContent>
          <div>
            <TasksType>{issuetype}</TasksType>
            <Typography
              variant="subtitle1"
              component='a'
              href={`https://jira.sezax-vt.jp/browse/${ticket_key}`}
              target='_blank'
              style={{marginLeft: '.5rem'}}
            >
              {ticket_key}
            </Typography>
          </div>
          {!!user_id ? <UserInfo {...props} id={user_id} /> : ''}
          <Typography
            variant="body2"
            component='p'
            color='textSecondary'
            gutterBottom
          >
            <TicketsLabel>{summary}</TicketsLabel>
          </Typography>
          <TasksStatus>{status.name}</TasksStatus>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

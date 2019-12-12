import React, { useContext, useEffect } from 'react';
import GetProductivity from '../../utils/GetProductivity';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { KPIStoreContext } from '../../contexts/KPIStore';
import TimeFormat from '../../utils/TimeFormat';
import {getTeam} from '../../components/TeamMember';
import { calcProductivity } from '../../utils/GetProductivity';

export default function ShowProfile({...props}) {
  const {id, name, position, sprintID, jira_id} = props;
  const { tickets: [tickets],
    productive: [productive, dispatchProductive] } = useContext(KPIStoreContext);
  const userTickets = tickets.filter((item) => item.user_id === id && item.sprint_ids.indexOf(sprintID.toString()) !== -1);
  const userProductiveData = getUserProductive(productive, id, sprintID);

  useEffect(() => {
    if( userProductiveData === undefined || userProductiveData.length === 0 ) {
      GetProductivity(id, sprintID).then((results) => {
        dispatchProductive({type: 'ADD_OR_UPDATE_PRODUCTIVE', data: [results.data]})
      })
    }
  }, [productive, sprintID])

  if(userProductiveData === undefined || userProductiveData.length === 0) {
    return(
      <Card>
         <CardHeader
          avatar={
            <Avatar aria-label="recipe">
              R
            </Avatar>
          }
          title={name}
          subheader={`${getTeam(jira_id)} - ${position}`}
        />
        <CardContent>
          <Skeleton variant="rect" height={20} width="80%" style={{marginBottom: '0.5rem'}} />
          <Skeleton variant="rect" height={20} width="60%" />
        </CardContent>
      </Card>
    );
  } else {
    return(
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe">
              R
            </Avatar>
          }
          title={name}
          subheader={`${getTeam(jira_id)} - ${position}`}
        />
        <CardContent>
          <Typography variant="subtitle1" component="p" color="textSecondary">
            Productivity: {`${calcProductivity(userProductiveData[0].kpi.main.done_tickets_estimate_total, userProductiveData[0].total_work_logs)}%`}
          </Typography>
          <Divider variant="fullWidth" style={{marginBottom: '.5rem', marginTop: '.5rem'}} />
          <Typography variant="body2" component="p" color="textSecondary">Estimated: {TimeFormat(userProductiveData[0].kpi.main.estimate_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">Done: {TimeFormat(userProductiveData[0].kpi.main.done_tickets_estimate_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">Sprint Work Logs: {TimeFormat(userProductiveData[0].kpi.main.sprint_work_logs_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">
            Work Log: {TimeFormat(userProductiveData[0].total_work_logs)}
          </Typography>
          <Divider variant="fullWidth" style={{marginBottom: '.5rem', marginTop: '.5rem'}} />
          <Typography variant="body2" component="p" color="textSecondary">Carried Over: {TimeFormat(userProductiveData[0].kpi.main.carried_over_logs_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">Do Over Total: {TimeFormat(userProductiveData[0].kpi.main.do_over_logs_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">Review Total: {TimeFormat(userProductiveData[0].kpi.main.review_time_spend_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">Total for Weeks: {TimeFormat(userProductiveData[0].total_for_weeks) || '-'}</Typography>
          <Divider variant="fullWidth" style={{marginBottom: '.5rem', marginTop: '.5rem'}} />
          <Typography variant="body2" component="p" color="textSecondary">Total Tickets: {userTickets.length}</Typography>
        </CardContent>
      </Card>
    );
  }
}

const getUserProductive = (productive, current_user_id, sprint_id) => {
  return productive.filter((item) => item.user_id === current_user_id && parseInt(item.target_sprint_id) === sprint_id );
};

ShowProfile.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string,
  sprintID: PropTypes.number.isRequired,
  jira_id: PropTypes.string.isRequired,
};

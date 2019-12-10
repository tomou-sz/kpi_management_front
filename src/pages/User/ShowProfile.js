import React, { useContext, useEffect } from 'react';
import GetProductivity from '../../utils/GetProductivity';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore';
import TimeFormat from '../../utils/TimeFormat';
import {getTeam} from '../../components/TeamMember';


export default function ShowProfile({...props}) {
  const {id, name, position, sprintID, jira_id} = props;
  const { tickets: [tickets],
    productive: [productive, dispatchProductive] } = useContext(KPIStoreContext);
  const userTickets = tickets.filter((item) => item.user_id === id && item.sprint_ids.indexOf(sprintID.toString()) !== -1);
  const userProductiveData = getUserProductive(productive, id, sprintID);

  useEffect(() => {
    if( userProductiveData === undefined || userProductiveData.length === 0 ) {
      GetProductivity(id, sprintID).then((results) => {
        dispatchProductive({type: 'ADD_OR_UPDATE_PRODUCTIVE', data: results.data})
      })
    }
  })

  if( Object.keys(props).length === 0) {
    return <Loading width={200} />
  }

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
            Productivity: {`${getUserProductivity(userProductiveData[0], getUserTotalWorkLogs(userProductiveData[0]))}%`}
          </Typography>
          <Divider variant="fullWidth" style={{marginBottom: '.5rem', marginTop: '.5rem'}} />
          <Typography variant="body2" component="p" color="textSecondary">Estimated: {TimeFormat(userProductiveData[0].estimate_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">Done: {TimeFormat(userProductiveData[0].done_tickets_estimate_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">
            Work Log: {TimeFormat(getUserTotalWorkLogs(userProductiveData[0]))}
          </Typography>
          <Typography variant="body2" component="p" color="textSecondary">Carried Over: {TimeFormat(userProductiveData[0].carried_over_logs_total) || '-'}</Typography>
          <Typography variant="body2" component="p" color="textSecondary">Actual Work: -</Typography>
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

const getUserTotalWorkLogs = (productive) => {
  return productive.sprint_work_logs_total + productive.carried_over_logs_total + productive.do_over_logs_total;
}

const getUserProductivity = (productive, totalWorkLogs) => {
  return parseInt(productive.done_tickets_estimate_total / totalWorkLogs * 100, 10) || '-';
}

ShowProfile.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string,
  sprintID: PropTypes.number.isRequired,
  jira_id: PropTypes.string.isRequired,
};

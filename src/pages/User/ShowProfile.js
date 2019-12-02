import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore';
import TimeFormat from '../../utils/TimeFormat';
import {getTeam} from '../../components/TeamMember';

export default function ShowProfile({...props}) {
  const {id, name, position, sprintID, jira_id} = props;
  const { tickets: [tickets] } = useContext(KPIStoreContext);
  const userTickets = tickets.filter((item) => item.user_id === id && item.sprint_id === sprintID);
  const TotalOriginalEstimate = userTickets.map((item) => item.original_estimate_seconds)
  .reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const TimeSpent = userTickets.map((item) => item.time_spent_seconds)
  .reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const TimeDone = userTickets.filter((item) => ['done', 'release'].indexOf(item.status_key) !== -1)
  .map((item) => item.time_spent_seconds)
  .reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  if( Object.keys(props).length === 0) {
    return <Loading width={200} />
  }

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
        {/* TODO: Productivity  */}
        <Typography variant="subtitle1" component="p" color="textSecondary">Productivity: {`${parseInt((TotalOriginalEstimate/TimeSpent) * 100, 10) || '-'}%`}</Typography>
        <Divider variant="fullWidth" style={{marginBottom: '.5rem', marginTop: '.5rem'}} />
        <Typography variant="body2" component="p" color="textSecondary">Estimated: {TimeFormat(TotalOriginalEstimate) || '-'}</Typography>
        <Typography variant="body2" component="p" color="textSecondary">Done: {TimeFormat(TimeDone) || '-'}</Typography>
        <Typography variant="body2" component="p" color="textSecondary">Work Log: {TimeFormat(TimeSpent) || '-'}</Typography>
        {/* TODO: Carried Over, Actual Work  */}
        <Typography variant="body2" component="p" color="textSecondary">Carried Over: -</Typography>
        <Typography variant="body2" component="p" color="textSecondary">Actual Work: -</Typography>
        <Divider variant="fullWidth" style={{marginBottom: '.5rem', marginTop: '.5rem'}} />
        <Typography variant="body2" component="p" color="textSecondary">Total Tickets: {userTickets.length}</Typography>
      </CardContent>
    </Card>
  );
}

ShowProfile.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  position: PropTypes.string,
  sprintID: PropTypes.number.isRequired,
  jira_id: PropTypes.string.isRequired,
};

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardContent} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Loading from '../../components/Loading';
import { KPIStoreContext } from '../../contexts/KPIStore';
import TimeFormat from '../../utils/TimeFormat';

export default function ShowProfile({...props}) {
  const {id, name, position, sprintID} = props;
  const { tickets: [tickets] } = useContext(KPIStoreContext);
  const userTickets = tickets.filter((item) => item.user_id === id && item.sprint_id === sprintID);
  const TotalOriginalEstimate = userTickets.map((item) => item.original_estimate_seconds).reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const TimeSpent = userTickets.map((item) => item.time_spent_seconds).reduce((accumulator, currentValue) => {
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
        subheader={position}
      />
      <CardContent>
        <Typography variant="subtitle1" component="p" color="textSecondary">Productivity: {`${parseInt((TotalOriginalEstimate/TimeSpent) * 100, 10)}%`}</Typography>
        <Typography variant="body2" component="p" color="textSecondary">Original Estimate: {TimeFormat(TotalOriginalEstimate)}</Typography>
        <Typography variant="body2" component="p" color="textSecondary">Time Spent: {TimeFormat(TimeSpent)}</Typography>
        <Typography variant="body2" component="p" color="textSecondary">Total Tickets: {userTickets.length}</Typography>
      </CardContent>
    </Card>
  );
}

ShowProfile.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  position: PropTypes.string,
  sprintID: PropTypes.number
};

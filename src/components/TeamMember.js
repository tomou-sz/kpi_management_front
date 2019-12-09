import React from 'react';
import Typography from '@material-ui/core/Typography';
import DefaultConfig from '../utils/DefaultConfig';
import PropTypes from 'prop-types';

export default function TeamMember({...props}) {
  const {jira_id} = props;
  return (
    <Typography variant="body2" component="p">{getTeam(jira_id)}</Typography>
  );
}

TeamMember.propTypes = {
  jira_id: PropTypes.string.isRequired,
};

export function getTeam(jira_id) {
  if(DefaultConfig.TEAM_FE.indexOf(jira_id) !== -1) {
    return 'Frontend Member';
  } else if(DefaultConfig.TEAM_FE_DESIGN.indexOf(jira_id) !== -1) {
    return 'Design Member';
  } else if(DefaultConfig.TEAM_BE.indexOf(jira_id) !== -1) {
    return 'Backend Member';
  } else if(DefaultConfig.TEAM_QC.indexOf(jira_id) !== -1) {
    return 'QC/QA Member';
  } else if(DefaultConfig.TEAM_INF.indexOf(jira_id) !== -1) {
    return 'Infrastructure Member';
  }
}

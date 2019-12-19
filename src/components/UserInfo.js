import React from 'react';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import { getTeam } from '../components/TeamMember';
import PropTypes from 'prop-types';

export default function UserInfo({...props}) {
  const {jira_id, id, name, position, useLink} = props;
  return (
    <HtmlTooltip
      placement="top-start"
      title={
        <>
          <Typography color="inherit">{name === '' ? id : name}</Typography>
          <em>{`${jira_id ? getTeam(jira_id) : ''} - ${position}`}</em>
        </>
      }
    >
      {useLink ? (
        <Typography noWrap display='block' variant="subtitle1" component={Link} to={`/user/${id}`}>{name === '' ? id : name}</Typography>
      ) : (
        <Typography noWrap display='block' variant="subtitle1">{name === '' ? id : name}</Typography>
      )}
    </HtmlTooltip>
  );
}

UserInfo.defaultProps = {
  name: '',
  position: '',
  useLink: true,
}

UserInfo.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  jira_id: PropTypes.string,
  position: PropTypes.string,
  useLink: PropTypes.bool,
};

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

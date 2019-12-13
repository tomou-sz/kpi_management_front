import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  statusText: {
    'font-size': '12px',
    'font-weight': 'bold',
    'overflow': 'hidden',
    'padding': '2px 5px',
    'text-transform': 'uppercase',
    'text-overflow': 'ellipsis',
    'white-space': 'nowrap'
  },
  status_label: {
    'border': '1px solid',
    'border-radius': '3px',
    'color': '#fff'
  },
  is_in_progress: {
    'background-color': '#0052cc',
    'border-color': '#0052cc',
    'color': '#fff'
  },
  is_released: {
    'background-color': '#00875a',
    'border-color': '#00875a',
    'color': '#fff'
  },
  is_default: {
    'background-color': '#42526e',
    'border-color': '#42526e',
    'color': '#fff'
  },
  text_nowrap: {
    'white-space': 'nowrap',
  }
})

export default function TasksStatus({...props}) {
  const classes = useStyles();
  const renderStatus = (statusType) => {
    switch(statusType) {
      case 'in-progress':
        return `${classes.status_label} ${classes.is_in_progress}`;
      case 'review':
        return `${classes.status_label} ${classes.is_in_progress}`;
      case 'done':
        return `${classes.status_label} ${classes.is_released}`;
      default:
        return `${classes.status_label} ${classes.is_default}`;
    }
  }
  return (
    <Tooltip {...props} className={renderStatus(props.children.toLowerCase())} title={props.children}>
      <span className={`${classes.statusText} ${classes.text_nowrap}`}>{props.children}</span>
    </Tooltip>
  );
}

TasksStatus.propTypes = {
  children: PropTypes.string.isRequired
};

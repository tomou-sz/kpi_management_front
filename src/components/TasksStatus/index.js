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
  is_todo: {
    'background-color': '#42526e',
    'border-color': '#42526e',
    'color': '#fff'
  },
  is_in_progress: {
    'background-color': '#0052CC',
    'border-color': '#0052CC',
    'color': '#fff'
  },
  is_done: {
    'background-color': '#e3fcef',
    'border-color': '#e3fcef',
    'color': '#064'
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
      case 'to do':
        return `${classes.status_label} ${classes.is_todo}`;
      case 'in progress':
        return `${classes.status_label} ${classes.is_in_progress}`;
      case 'review':
        return `${classes.status_label} ${classes.is_in_progress}`;
      case 'beta test done':
        return `${classes.status_label} ${classes.is_done}`;
      case 'ready for release':
        return `${classes.status_label} ${classes.is_done}`;
      case 'released':
        return `${classes.status_label} ${classes.is_done}`;
      case 'done':
        return `${classes.status_label} ${classes.is_done}`;
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

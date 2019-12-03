import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import BugSVG from '../../assets/TasksType/bug.svg';
import TaskSVG from '../../assets/TasksType/task.svg';
import SubtaskSVG from '../../assets/TasksType/sub_task.svg';

export default function TasksType({...props}) {
  const renderIssuesImg = (issuesType) => {
    switch(issuesType) {
      case 'task':
        return TaskSVG;
      case 'sub-task':
        return SubtaskSVG;
      case 'bug':
        return BugSVG;
      default:
        return TaskSVG;
    }
  }
  return (
    <Tooltip title={props.children}>
      <span>
        <img src={renderIssuesImg(props.children.toLowerCase())} title={props.children} alt={props.children} />
      </span>
    </Tooltip>
  );
}

TasksType.propTypes = {
  children: PropTypes.string.isRequired
}

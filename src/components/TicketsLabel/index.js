import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  label_text: {
    'background-color': '#42526e',
    'border': '1px solid',
    'border-color': '#42526e',
    'border-radius': '3px',
    'color': '#fff',
    'font-weight': 'bold',
    'margin-right': '4px',
    'padding': '2px 5px'
  },
  team_label: {
    'border': '1px solid',
    'border-radius': '3px',
    'color': '#fff',
    'margin-right': '4px',
    'padding': '2px 8px',
    'text-transform': 'uppercase'
  },
  is_be: {
    'background-color': '#cc3b23',
    'border-color': '#cc3b23'
  },
  is_fe: {
    'background-color': '#e78f07',
    'border-color': '#e78f07'
  },
  is_qc: {
    'background-color': '#00b6de',
    'border-color': '#00b6de'
  },
  is_inf: {
    'background-color': '#49a564',
    'border-color': '#49a564'
  },
  is_design: {
    'background-color': '#155724',
    'border-color': '#155724'
  }
})

export default function TicketsLabel({...props}) {
  const classes = useStyles();
  const renderTeamLabel = (name) => {
    switch(name) {
      case 'fe':
        return `${classes.team_label} ${classes.is_fe}`;
      case 'be':
        return `${classes.team_label} ${classes.is_be}`;
      case 'qc':
        return `${classes.team_label} ${classes.is_qc}`;
      case 'inf':
        return `${classes.team_label} ${classes.is_inf}`;
      case 'design':
        return `${classes.team_label} ${classes.is_design}`;
      default:
        return classes.label_text;
    }
  }
  const renderLabel = () => {
    if (props.children.match(/\[.*?\]/g)) {
      return props.children.match(/\[.*?\]/g).map((ticket, index) => {
        return(
          <span key={index} className={renderTeamLabel(ticket.replace(/[[\]]/g,'').toLowerCase())}>
            {ticket.replace(/[[\]]/g,'')}
          </span>
        )
      })
    }
  }
  const renderTitle = () => {
    return(
      <span style={{ fontWeight: 'bold' }} >{props.children.replace(/\[.*?\]/g, '').trim()}</span>
    )
  }

  return(
    <div>
      <>
        {renderLabel()}
        {renderTitle()}
      </>
    </div>
  );
}

TicketsLabel.propTypes = {
  children: PropTypes.string.isRequired
}
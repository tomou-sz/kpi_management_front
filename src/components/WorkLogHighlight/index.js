import React from 'react';
import PropTypes from 'prop-types';

const renderContent = (logtime) => {
  const isToday = (new Date(logtime.date)).toDateString()  === (new Date()).toDateString() ? true : false;
  const isPastDate = (new Date(logtime.date)) < (new Date()) ? true : false;

  if(logtime.total_time_spent < 8 && ( isToday || isPastDate )) {
    return <div style={{ color: 'red', fontWeight: 'bold'}}>{logtime.total_time_spent}</div>
  } else {
    return <div>{logtime.total_time_spent}</div>
  }
}

export default function WorkLogHighlight(props) {
  return(
    <>
      {renderContent(props.logtime)}
    </>
  );
}

WorkLogHighlight.defaultProps = {
  logtime: 0
}

WorkLogHighlight.propTypes = {
  logtime: PropTypes.object.isRequired
}

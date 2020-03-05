import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import DefaultConfig from '../utils/DefaultConfig';

export default function SelectTeam({...props}) {
  if(DefaultConfig.TEAM_LIST.length === 0) {
    return 'Loading';
  }

  return (
    <Select
      native
      {...props}
    >
      {DefaultConfig.TEAM_LIST.map((item, idx) => {
      return <option key={idx} value={item.name}>{item.title}</option>
      })}
    </Select>
  );
}

SelectTeam.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

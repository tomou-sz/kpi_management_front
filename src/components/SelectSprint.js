import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { KPIStoreContext } from '../contexts/KPIStore';

export default function SelectSprint({...props}) {
  const { boardSprints: [boardSprints] } = useContext(KPIStoreContext);

  if(boardSprints.length === 0) {
    return '';
  }

  return (
    <Select
      native
      {...props}
    >
      {boardSprints.map((item, idx) => {
        return <option key={idx} value={item.id}>SPRINT: {item.id}</option>
      })}
    </Select>
  );
}

SelectSprint.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

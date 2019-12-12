import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { KPIStoreContext } from '../contexts/KPIStore';
import { dateFormat } from '../utils/TimeFormat';

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
        const sprint_name = `sprint_${dateFormat(new Date(item.start_date), '_')} ~ sprint_${dateFormat(new Date(item.end_date), '_')}`;
        return <option key={idx} value={item.id}>{(item.start_date === null || item.end_date === null) ? `sprint_${item.id}` : sprint_name}</option>
      })}
    </Select>
  );
}

SelectSprint.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

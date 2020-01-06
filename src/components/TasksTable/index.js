import React, { useState, useContext } from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';
import TableLayout from './TableLayout';
import KanbanLayout from './KanbanLayout';
import { KPIStoreContext } from '../../contexts/KPIStore';

export default function TasksTable({...props}) {
  const { data } = props;
  const { setting: [setting, setSetting] } = useContext(KPIStoreContext);
  const [typeFilter, setTypeFilter] = useState({
    Task: true,
    Bug: true,
    'Sub-task': true,
  });

  const filterList = ['Task', 'Bug', 'Sub-task'];
  const selectedFilter = filterList.filter(item => typeFilter[item]);

  const handleChange = (name) => (event) => {
    setTypeFilter({ ...typeFilter, [name]: event.target.checked });
  };

  const handleChangeLayout = () => (event) => {
    setSetting({...setting, layout: event.target.checked});
  };

  return(
    <>
      <div>
        <FormControl>
          <FormGroup row style={{ 'justifyContent': 'center', 'alignItems': 'center' }} >
            <FormLabel component="legend" style={{ 'paddingLeft': '10px', 'paddingRight': '10px' }}>Type Filter: </FormLabel>
            {
              filterList.map((item, idx) => {
                return (
                  <FormControlLabel
                    key={idx}
                    control={<Checkbox color="primary" checked={typeFilter[item]} onChange={handleChange(item)} value={item} />}
                    label={`${item} (${data.filter(issue => issue.issuetype === item).length})`}
                  />
                );
              })
            }
            <FormLabel component="legend" style={{ 'paddingLeft': '10px', 'paddingRight': '10px' }}>Layout: </FormLabel>
            <FormControlLabel
              control={<Checkbox color="primary" checked={setting.layout} onChange={handleChangeLayout()} value='kanban' />}
              label='Kanban'
            />
          </FormGroup>
        </FormControl>
      </div>
      {
        setting.layout ?
        <KanbanLayout {...props} data={data.filter(item => selectedFilter.indexOf(item.issuetype) !== -1)} />
        :
        <TableLayout {...props} data={data.filter(item => selectedFilter.indexOf(item.issuetype) !== -1)} />
      }
    </>
  );
};

TasksTable.defaultProps = {
  data: [],
  progressing: false,
  showAssignee: false,
  assigneeLink: true,
};

TasksTable.propTypes = {
  data: PropTypes.array.isRequired,
  progressing: PropTypes.bool,
  showAssignee: PropTypes.bool,
  assigneeLink: PropTypes.bool,
};

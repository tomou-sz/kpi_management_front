import React, { useContext, useEffect, useRef } from "react";
import Paper from '@material-ui/core/Paper';
import GetProductivity from '../../utils/GetProductivity';
import ProductiveTable from '../../components/ProductiveTable';
import { KPIStoreContext } from '../../contexts/KPIStore';
import DefaultConfig from '../../utils/DefaultConfig';
import { CancelToken } from 'axios';

export default function ProductiveSection({...props}) {
  const {sprint_id, reload, name} = props;
  const { users: [users],
  productive: [productive, dispatchProductive] } = useContext(KPIStoreContext);
  const jira_ids = DefaultConfig[name];
  const user_ids = users.filter(item => jira_ids.indexOf(item.jira_id) !== -1).map(item => item.id);
  const productiveData = getProductiveTable(productive, jira_ids, sprint_id);
  const prevReloadState = useRef(reload);
  const source = CancelToken.source();

  useEffect(() => {
    if( prevReloadState.current !== reload ) {
      dispatchProductive({type: 'REMOVE_PRODUCTIVE', target_sprint_id: sprint_id})
    }

    if( productiveData.length === 0 || prevReloadState.current !== reload) {
      let promises = user_ids.map(item => {
        return GetProductivity(item, sprint_id, { cancelToken: source.token }).then(results => {
          const productivity = results.data;
          const currentUser = users.filter(item => item.jira_id === productivity.jira_id)[0];
          return Object.assign(productivity, currentUser);
        })
      });
      Promise.all(promises).then(results => {
        dispatchProductive({type: 'ADD_OR_UPDATE_PRODUCTIVE', data: results})
      });
    }

    prevReloadState.current = reload;
    return (() => {
      source.cancel()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprint_id, reload])

  return (
    <Paper style={{marginBottom: '1rem'}}>
      <ProductiveTable data={productiveData.length !== 0 ? productiveData : undefined} />
    </Paper>
  )
}

const getProductiveTable = (data, jira_ids, target_sprint_id) => {
  return data.filter(item => jira_ids.indexOf(item.jira_id) !== -1 && parseInt(item.target_sprint_id) === target_sprint_id);
};

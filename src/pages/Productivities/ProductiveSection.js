import React, { useState, useContext, useEffect } from "react";
import Paper from '@material-ui/core/Paper';
import GetProductivity from '../../utils/GetProductivity';
import ProductiveTable from '../../components/ProductiveTable';
import { KPIStoreContext } from '../../contexts/KPIStore';
import DefaultConfig from '../../utils/DefaultConfig';

export default function Dashboard({...props}) {
  const {sprint_id, reload, name} = props;
  const { users: [users] } = useContext(KPIStoreContext);
  const [productive, setProductive] = useState([]);
  const jira_ids = DefaultConfig[name];
  const user_ids = users.filter((item) => jira_ids.indexOf(item.jira_id) !== -1).map((item) => item.id);

  useEffect(() => {
    setProductive([])
    let promises = user_ids.map((item) => {
      return GetProductivity(item, sprint_id).then((results) => {
        const productive = results.data;
        const currentUser = users.filter((item) => item.jira_id === productive.jira_id)[0];
        return Object.assign(productive, currentUser);
      })
    });
    Promise.all(promises).then((results) => {
      setProductive(results)
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprint_id, reload])

  return (
    <Paper style={{marginBottom: '1rem'}}>
      <ProductiveTable data={productive.length !== 0 ? productive : undefined} />
    </Paper>
  )
}

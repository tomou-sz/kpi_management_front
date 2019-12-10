import axios from 'axios';

export default (jiraID, date, options) => {
  if( options === null || options === undefined ) {
    options = {}
  }
  return axios.get(process.env.REACT_APP_SERVER_URL + '/daily_work_logs/get_work_log', Object.assign(options, {
    params: {
      jira_id: jiraID,
      date: date,
    }
  }))
  .then((results) => {
    return {
      jira_id: results.data.data.jira_id,
      date: results.config.params.date,
      total_time_spent: results.data.data.total_time_spent
    }
  })
}

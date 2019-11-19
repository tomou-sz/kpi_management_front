import React from 'react'
import axios from 'axios'

class WorkLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      worklog: []
    }
  }
  componentDidMount() {
    axios.get(process.env.REACT_APP_SERVER_URL + '/daily_work_logs/get_work_log', {
      params: {
        jira_id: this.props.jiraID,
        date: this.props.date,
      }
    })
    .then((results) => {
      this.setState({worklog: results.data})
    })
    .catch((data) =>{
      console.log(data)
    })
  }

  render() {
    return(
      <td>{this.state.worklog.total_time_spent}</td>
    )
  }
}

export default WorkLog;

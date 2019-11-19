import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import DailyWorkLogsTable from './DailyWorkLogs/DailyWorkLogsTable'

class DailyWorkLogs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      work_logs: [],
      loading: true,
    }
  }

  componentDidMount() {
    axios.get(process.env.REACT_APP_SERVER_URL + '/users')
    .then((results) => {
      console.log(results)
      this.setState({users: results.data})
    })
    .catch((data) =>{
      console.log(data)
    })
  }

  render() {
    return (
      <div>
        <DailyWorkLogsTable users={this.state.users} worklogs={this.state.worklogs}/>
        <Link to="/">Back</Link>
      </div>
    );
  }
}

export default DailyWorkLogs;

import React from 'react'
import Table from 'react-bootstrap/Table';
import WorkLog from './WorkLog'

class DailyWorkLogsTable extends React.Component {
  constructor(props) {
    super(props);
    let dateArray = [];
    for (let i = 0; i < 5; i++) {
      dateArray.push(this.getDate(i))
    }
    dateArray.sort(function(a,b) {
      return (a.date > b.date ? 1 : -1);
    });
    this.state = {
      targetDateRange: dateArray,
    }
  }

  getDate(day_later) {
    var date = new Date();
    date.setDate(date.getDate() - day_later);
    var year  = date.getFullYear();
    var month = date.getMonth() + 1;
    var day   = ("0" + date.getDate()).slice(-2);
    return String(year) + "-" + String(month) + "-" + String(day);
  }

  render() {
    const users = this.props.users
    const targetDateRange = this.state.targetDateRange
    return (
      <center>
        <Table>
          <tbody>
            <tr>
              <td>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      return(
                        <tr key={user.id}>
                          <td> { user.name } </td>
                        </tr>

                      )
                    })}
                  </tbody>
                </Table>
              </td>
              <td valign="top">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {targetDateRange.map((date) => {
                        return (
                          <th key={date}>{date}</th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      return (
                        <tr key={user.id}>
                          {targetDateRange.map((date) => {
                            return (
                              <WorkLog
                                jiraID={user.jira_id}
                                date={date}
                              />
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </td>
            </tr>
          </tbody>
        </Table>
      </center>
    )
  }
}

export default DailyWorkLogsTable;

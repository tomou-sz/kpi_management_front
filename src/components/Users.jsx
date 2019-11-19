import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table';

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    console.log(process.env.REACT_APP_SERVER_URL + '/users')
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
    return(
      <div className='bd-example'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Jira ID</th>
              <th scope="col">Position</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((data) => {
              return(
                <tr key={data.id}>
                  <th scope="row">{ data.id }</th>
                  <td>{ data.name }</td>
                  <td>{ data.jira_id }</td>
                  <td>{ data.position }</td>
                </tr>
              )
            })}
          </tbody>
        </Table>

        <Link to="/">Back</Link>
      </div>
    )
  }
}

export default Users

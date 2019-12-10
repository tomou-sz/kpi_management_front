import axios from 'axios';

export default function GetTasks(userID, sprintID, options) {
  if( options === null || options === undefined ) {
    options = {}
  }
  return axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${userID}/sprint_tickets?sprint_id=${sprintID}`, options)
  .then((results) => {
    return results.data
  })
}

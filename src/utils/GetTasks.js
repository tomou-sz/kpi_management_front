import axios from 'axios';

export default function GetTasks(userID, sprintID) {
  return axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${userID}/sprint_tickets?sprint_id=${sprintID}`)
}

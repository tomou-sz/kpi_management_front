import axios from 'axios';

export default function GetTasks(userID, sprintID, options) {
  if( options === null || options === undefined ) {
    options = {};
  }
  return axios.get(`${process.env.REACT_APP_SERVER_URL}/users/${userID}/sprint_tickets?sprint_id=${sprintID}`, options)
  .then((results) => {
    return results.data;
  });
}

export const IncludeUserInfo = (ticket, user) => {
  if(user.name === undefined || user.name === null) {
    user.name = user.jira_id || user.user_id;
  }
  return Object.assign(ticket, user);
};

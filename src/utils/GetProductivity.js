import axios from 'axios';

export default (user_id, sprint_id) => {
  return axios.get(`${process.env.REACT_APP_SERVER_URL}/productivities/sprint_productivity?sprint_id=${sprint_id}&user_id=${user_id}`)
  .then((results) => {
    return results.data
  })
}

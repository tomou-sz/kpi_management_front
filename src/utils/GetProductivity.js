import axios from 'axios';

export default (user_id, sprint_id, options) => {
  if( options === null || options === undefined ) {
    options = {}
  }
  return axios.get(`${process.env.REACT_APP_SERVER_URL}/productivities/sprint_productivity?sprint_id=${sprint_id}&user_id=${user_id}`, options)
  .then((results) => {
    return results.data
  })
}

export function calcProductivity(done, total) {
  if (total === 0) {
    return 100;
  }
  return Math.ceil((done / total) * 100) || 0;
}

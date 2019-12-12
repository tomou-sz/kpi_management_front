import axios from 'axios';

export default (options) => {
  if( options === null || options === undefined ) {
    options = {}
  }
  return axios.get(process.env.REACT_APP_SERVER_URL + '/sprints/board_sprints', options)
  .then((results) => {
    // localStorage.setItem('boardSprints', JSON.stringify(results.data.data));
    return results.data
  })
}

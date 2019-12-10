import axios from 'axios';

export default () => {
  return axios.get(process.env.REACT_APP_SERVER_URL + '/sprints/board_sprints')
  .then((results) => {
    // localStorage.setItem('boardSprints', JSON.stringify(results.data.data));
    return results.data
  })
}

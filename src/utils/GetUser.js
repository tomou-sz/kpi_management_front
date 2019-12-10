import axios from 'axios';

export default () => {
  return axios.get(process.env.REACT_APP_SERVER_URL + '/users')
  .then((results) => {
    return results.data
  })
}

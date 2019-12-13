import axios from 'axios';

export default (options) => {
  if( options === null || options === undefined ) {
    options = {}
  }
  return axios.get(process.env.REACT_APP_SERVER_URL + '/users', options)
  .then((results) => {
    return results.data
  })
}

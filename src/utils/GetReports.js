import axios from 'axios';

export const GetTotalRemainStoryPoints = (options) => {
  if( options === null || options === undefined ) {
    options = {};
  }
  return axios.get(process.env.REACT_APP_SERVER_URL + '/reports/total_sprint_remaining_story_point', options)
  .then((results) => {
    return results.data;
  });
};

export const GetTotalTimeTrack = (options) => {
  if( options === null || options === undefined ) {
    options = {};
  }
  return axios.get(process.env.REACT_APP_SERVER_URL + '/reports/total_sprint_time_tracking', options)
  .then((results) => {
    return results.data;
  });
};

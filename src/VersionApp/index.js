export default () => {
  if(typeof localStorage.getItem('v?') === 'undefined' || localStorage.getItem('v?') === null) {
    localStorage.setItem('v?', process.env.REACT_APP_VERSION);
  }
  if(localStorage.getItem('v?') !== process.env.REACT_APP_VERSION){
    localStorage.clear();
  }
};

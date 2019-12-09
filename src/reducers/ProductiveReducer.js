export default (state, action) => {
  switch (action.type) {
    case 'ADD_OR_UPDATE_PRODUCTIVE':
      let productiveList = [...state];
      for (let i=0; i< action.data.length; i++) {
        let item = action.data[i];
        let getIdx = findIndexByProperty(productiveList, item.jira_id, item.target_sprint_id);
        if( getIdx === -1) {
          productiveList.push(item)
        } else {
          productiveList[getIdx] = item;
        }
      }
      // Cache productivities
      localStorage.setItem('productivities', JSON.stringify(productiveList));
      return productiveList;
    case 'REMOVE_PRODUCTIVE':
      const productiveFilter = state.filter(item => parseInt(item.target_sprint_id) !== action.target_sprint_id);
      // Cache productivities
      localStorage.setItem('productivities', JSON.stringify(productiveFilter));
      return productiveFilter;
    default:
      return state;
  }
};

const findIndexByProperty = (data, jira_id, target_sprint_id) => {
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (item.jira_id === jira_id && item.target_sprint_id === target_sprint_id) {
      return i;
    }
  }
  return -1;
};

export const initProductive = JSON.parse(localStorage.getItem('productivities')) || [];

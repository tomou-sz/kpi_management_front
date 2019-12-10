import { calcProductivity } from '../utils/GetProductivity';

export default (state, action) => {
  switch (action.type) {
    case 'ADD_OR_UPDATE_PRODUCTIVE':
      let productiveList = [...state];
      for (let i=0; i< action.data.length; i++) {
        let item = calcWorklogs(action.data[i]);
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

const calcWorklogs = (item) => {
  const mainProject = item.kpi.main;
  const othersProject = item.kpi.others;
  const total_work_logs = mainProject.sprint_work_logs_total + mainProject.carried_over_logs_total + mainProject.do_over_logs_total;
  const productivity = `${calcProductivity(mainProject.done_tickets_estimate_total, total_work_logs)}%`;
  const total_for_weeks = mainProject.sprint_work_logs_total + mainProject.review_time_spend_total + othersProject.work_logs_total;

  item.total_work_logs = total_work_logs || 0;
  item.productivity = productivity;
  item.total_for_weeks = total_for_weeks || 0;
  return item;
}

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

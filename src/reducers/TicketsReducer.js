export default (state, action) => {
  switch (action.type) {
    case 'ADD_OR_UPDATE_TICKETS':
      let ticketsList = [...state];
      for (let i=0; i< action.data.length; i++) {
        let item = action.data[i];
        let getIdx = findIndexByProperty(ticketsList, 'key', item.key);
        if( getIdx === -1) {
          ticketsList.push(item);
        } else {
          ticketsList[getIdx] = item;
        }
      }
      // Cache tickets
      localStorage.setItem('tickets', JSON.stringify(ticketsList));
      return ticketsList;
    case 'REMOVE_TICKETS':
      if( typeof action.filter !== 'function' ) {
        return state;
      }
      const ticketsFilted = state.filter(action.filter);
      // Cache tickets
      localStorage.setItem('tickets', JSON.stringify(ticketsFilted));
      return ticketsFilted;
    default:
      return state;
  }
};

const findIndexByProperty = (array, property, value) => {
  for(var i = 0; i < array.length; i += 1) {
    if(array[i][property] === value) {
      return i;
    }
  }
  return -1;
};

export const initTickets = JSON.parse(localStorage.getItem('tickets')) || [];

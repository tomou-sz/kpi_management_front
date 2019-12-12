// contexts/KPIStore.js
import React, { useState, createContext, useReducer } from 'react';
import ProductiveReducer, { initProductive } from '../reducers/ProductiveReducer';
import TicketsReducer, { initTickets } from '../reducers/TicketsReducer';

export const KPIStoreContext = createContext(null);

export default ({ children }) => {
  const [workLogs, setWorkLogs] = useState(JSON.parse(localStorage.getItem('workLogs')) || []);
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const [tickets, dispatchTickets] = useReducer(TicketsReducer, initTickets);
  const [boardSprints, setBoardSprints] = useState([]);
  const [productive, dispatchProductive] = useReducer(ProductiveReducer, initProductive);

  const store = {
    workLogs: [workLogs, setWorkLogs],
    users: [users, setUsers],
    tickets: [tickets, dispatchTickets],
    boardSprints: [boardSprints, setBoardSprints],
    productive: [productive, dispatchProductive],
  };

  return (<KPIStoreContext.Provider value={store}>{children}</KPIStoreContext.Provider>);
}

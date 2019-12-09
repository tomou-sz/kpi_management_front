// contexts/KPIStore.js
import React, { useState, createContext, useReducer } from 'react';
import ProductiveReducer, { initProductive } from '../reducers/ProductiveReducer';

export const KPIStoreContext = createContext(null)

export default ({ children }) => {
  const [workLogs, setWorkLogs] = useState(JSON.parse(localStorage.getItem('workLogs')) || []);
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const [tickets, setTickets] = useState(JSON.parse(localStorage.getItem('tickets')) || []);
  const [boardSprints, setBoardSprints] = useState(JSON.parse(localStorage.getItem('boardSprints')) || []);
  const [productive, setProductive] = useReducer(ProductiveReducer, initProductive);

  const store = {
    workLogs: [workLogs, setWorkLogs],
    users: [users, setUsers],
    tickets: [tickets, setTickets],
    boardSprints: [boardSprints, setBoardSprints],
    productive: [productive, setProductive],
  }

  return <KPIStoreContext.Provider value={store}>{children}</KPIStoreContext.Provider>
}

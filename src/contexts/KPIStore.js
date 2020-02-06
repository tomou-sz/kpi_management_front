// contexts/KPIStore.js
import React, { useState, createContext, useReducer } from 'react';
import ProductiveReducer, { initProductive } from '../reducers/ProductiveReducer';
import TicketsReducer, { initTickets } from '../reducers/TicketsReducer';
import StoryPointsReducer, { initStoryPoints } from '../reducers/StoryPointsReducer';

export const KPIStoreContext = createContext(null);

export default ({ children }) => {
  const [workLogs, setWorkLogs] = useState(JSON.parse(localStorage.getItem('workLogs')) || []);
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const [tickets, dispatchTickets] = useReducer(TicketsReducer, initTickets);
  const [boardSprints, setBoardSprints] = useState([]);
  const [productive, dispatchProductive] = useReducer(ProductiveReducer, initProductive);
  const [storyPoints, dispatchStoryPoints] = useReducer(StoryPointsReducer, initStoryPoints);
  const [setting, setSetting] = useState({
    layout: false,
  });

  const store = {
    workLogs: [workLogs, setWorkLogs],
    users: [users, setUsers],
    tickets: [tickets, dispatchTickets],
    boardSprints: [boardSprints, setBoardSprints],
    productive: [productive, dispatchProductive],
    storyPoints: [storyPoints, dispatchStoryPoints],
    setting: [setting, setSetting],
  };

  return (<KPIStoreContext.Provider value={store}>{children}</KPIStoreContext.Provider>);
}

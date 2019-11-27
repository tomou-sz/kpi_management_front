// contexts/KPIStore.js
import React, { useState, createContext } from 'react';

export const KPIStoreContext = createContext(null)

export default ({ children }) => {
  const [workLogs, setWorkLogs] = useState(JSON.parse(localStorage.getItem('workLogs')) || [])
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || [])

  const store = {
    workLogs: [workLogs, setWorkLogs],
    users: [users, setUsers]
  }

  return <KPIStoreContext.Provider value={store}>{children}</KPIStoreContext.Provider>
}

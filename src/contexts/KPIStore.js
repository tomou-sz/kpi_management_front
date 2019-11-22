// contexts/KPIStore.js
import React, { useState, createContext } from 'react';

export const KPIStoreContext = createContext(null)

export default ({ children }) => {
  const [workLogs, setWorkLogs] = useState([])
  const [users, setUsers] = useState([])

  const store = {
    workLogs: [workLogs, setWorkLogs],
    users: [users, setUsers]
  }

  return <KPIStoreContext.Provider value={store}>{children}</KPIStoreContext.Provider>
}

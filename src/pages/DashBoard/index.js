import React, { useContext, useEffect } from "react";
import Menu from "../../components/Menu";
import GetUser from '../../utils/GetUser.js';
import { KPIStoreContext } from '../../contexts/KPIStore.js';

export default function Dashboard() {
  const { users: [users, setUsers] } = useContext(KPIStoreContext);

  useEffect(() => {
    if( users.length === 0 ) {
      GetUser().then((results) => {
        setUsers(results.data)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h1>Dashboard</h1>
      <Menu/>
    </>
  );
}

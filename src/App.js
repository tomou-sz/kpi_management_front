import React from 'react';
import { Router } from "react-router-dom";
import history from "./services/history";
import Routes from "./routes";
import GlobalStyles from "./styles/global";
import KPIStoreProvider from './contexts/KPIStore.js';

function App() {
  return (
    <KPIStoreProvider>
      <Router history={history}>
        <Routes />
        <GlobalStyles />
      </Router>
    </KPIStoreProvider>
  );
}

export default App;

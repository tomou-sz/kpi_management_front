import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import DailyWorkLogs from './components/DailyWorkLogs'
import Users from './components/Users'
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" component={Dashboard} exact={true} />
        <Route path="/daily_work_logs" component={DailyWorkLogs} />
        <Route path="/users" component={Users} />
      </div>
    );
  }
}

export default App;

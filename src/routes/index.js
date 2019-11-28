import React from "react";
import { Switch } from "react-router-dom";
import Route from "./Route";
import Dashboard from '../pages/DashBoard';
import DailyWorkLogs from '../pages/DailyWorkLogs';
import Users from '../pages/Users';
import SignIn from '../pages/SignIn';
import User from '../pages/User';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} exact isPrivate title='Dashboard' />
      <Route path="/dashboard" component={Dashboard} exact isPrivate title='Dashboard' />
      <Route path="/daily_work_logs" component={DailyWorkLogs} isPrivate title='Daily Work Logs' />
      <Route path="/users" component={Users} isPrivate title='Member List' />
      <Route path="/user/:id" component={User} isPrivate title='Member' />

      {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
      <Route component={SignIn} />
    </Switch>
  );
}

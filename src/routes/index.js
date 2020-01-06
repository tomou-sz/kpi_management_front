import React from "react";
import { Switch } from "react-router-dom";
import Route from "./Route";
import Dashboard from '../pages/DashBoard';
import DailyWorkLogs from '../pages/DailyWorkLogs';
import Users from '../pages/Users';
import SignIn from '../pages/SignIn';
import User from '../pages/User';
import Productivities from '../pages/Productivities';
import TeamTickets from '../pages/TeamTickets';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} exact isPrivate title='Dashboard' />
      <Route path="/dashboard" component={Dashboard} exact isPrivate title='Dashboard' />
      <Route path="/daily_work_logs" component={DailyWorkLogs} isPrivate title='Daily Work Logs' />
      <Route path="/users" component={Users} isPrivate title='Member List' />
      <Route path="/user/:id" component={User} isPrivate title='Member' />
      <Route path="/productivities" component={Productivities} isPrivate title='Productivities' />
      <Route path="/team_tickets" component={TeamTickets} isPrivate title='Team Tickets' />

      {/* redirect user to SignIn page if route does not exist and user is not authenticated */}
      <Route component={SignIn} />
    </Switch>
  );
}

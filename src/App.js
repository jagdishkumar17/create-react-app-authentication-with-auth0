import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Auth from "./auth/Auth";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import history from "./utils/history";
import Callback from "./auth/Callback";
import SecureRoute from "./auth/SecureRoute";

const auth = new Auth();

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
          {/* BASE  ROUTES  */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login" component={Login} />
          <SecureRoute exact path="/dashboard" component={Dashboard} />
          }/>
        </Switch>
      </Router>
    );
  }
}

export default App;

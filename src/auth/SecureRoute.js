import React from 'react';
import { Route, Redirect } from "react-router-dom";
import Auth from "./Auth";

const auth = new Auth();
  const SecureRoute = ({component: Component, ...rest}) => {
   const isAuthenticated  = auth.isAuthenticated();
    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
     
        <Route {...rest} render={props => (
          isAuthenticated ?
                <Component {...props} />
            : <Redirect to="/login" />
        )} />
    );
};

export default SecureRoute;
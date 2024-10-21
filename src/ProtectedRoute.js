import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { auth } from './firebase';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

// Classifies the type of prop that was brought in from the store. Why this has to be a separate function? I don't know... Seems to just make things more confusing.
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

// Brings these state properties in from the reducer and store.
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);

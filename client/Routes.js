import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import { Login, Signup } from "./components/AuthForm";
import Home from "./components/Home";
import ClientSideSocket from "./components/Socket";
import ContactList from "./components/ContactList";
import { me } from "./store";
import history from "./history";
import { clientSideFunc } from "./socket";
import Conversation from "./components/Conversation";

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();

    // let localStorage = window.localStorage;

    // let connected = localStorage.getItem("connected");

    // localStorage.setItem("connected", true);
    // clientSideFunc(auth);
  }
  render() {
    const { isLoggedIn, auth } = this.props;

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/message" component={ClientSideSocket} />
            <Route path="/conversation" component={ContactList} />

            <Redirect to="/conversation" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
    auth: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));

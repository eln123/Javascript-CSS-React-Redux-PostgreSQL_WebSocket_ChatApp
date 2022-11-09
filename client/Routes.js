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
import { setSocket } from "./store/socket";
import Conversation from "./components/Conversation";
import AddContact from "./components/AddContact";

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    if (history.location.pathname !== "conversation") {
      this.props.loadInitialData();
    }
    const auth = this.props.auth;
    const socket = clientSideFunc(auth);

    this.props.setSocket(socket);
  }
  render() {
    const { isLoggedIn, auth } = this.props;

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/conversation" component={ContactList} />
            <Route path="/addContact" component={AddContact} />
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
    socket: state.socket,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
    setSocket(socket) {
      dispatch(setSocket(socket));
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));

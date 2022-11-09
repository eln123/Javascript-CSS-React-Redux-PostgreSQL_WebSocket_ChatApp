import React from "react";
import { connect } from "react-redux";
import { clientSideFunc } from "../socket";

/**
 * COMPONENT
 */
export class Conversation extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { username } = this.props.username;

    return (
      <div>
        <h2>{username}</h2>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
    contacts: state.auth.contacts,
    messages: state.auth.messages,
  };
};

export default connect(mapState)(Conversation);

import React from "react";
import { connect } from "react-redux";
import { clientSideFunc } from "../socket";

/**
 * COMPONENT
 */
export const ClientSideSocket = (props) => {
  const { username } = props;

  return <div>{username}</div>;
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(ClientSideSocket);

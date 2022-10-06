import { render } from "enzyme";
import React from "react";
import { connect } from "react-redux";
import { clientSideFunc } from "../socket";
import { getMessages, me } from "../store/auth";
import history from "../history";
import axios from "axios";

/**
 * COMPONENT
 */

export const setIdOfMessage = (message, user) => {
  if (message.sender === user.phoneNumber) {
    return "sentMessage";
  } else {
    return "receivedMessage";
  }
};
export class ContactList extends React.Component {
  constructor() {
    super();
    this.state = {
      change: false,
      reload: false,
      room: "",
    };
    this.selectContact = this.selectContact.bind(this);
  }
  componentDidMount() {
    const user = this.props.user;
    clientSideFunc(user);
    this.props.loadInitialData();
  }
  async selectContact(contact, e) {
    e.preventDefault();
    const user = this.props.user;
    const room = `${Math.min(user.phoneNumber, contact.phoneNumber)}${Math.max(
      user.phoneNumber,
      contact.phoneNumber
    )}`;
    history.location.state = `${user.phoneNumber}${contact.phoneNumber}`;
    this.setState({ ...this.state, room });
    this.props.loadInitialData();
  }
  render() {
    const user = this.props.updatedUser
      ? this.props.updatedUser
      : this.props.user;
    const contacts = user.contacts;
    const messages = this.props.user.messages;
    return (
      <div>
        <div>
          {contacts ? (
            <ul>
              {" "}
              {contacts.map((contact, index) => (
                <button
                  id="pleaseWork"
                  key={contact.id}
                  onClick={(e) => this.selectContact(contact, e)}
                >
                  {contact.contactName}
                </button>
              ))}
            </ul>
          ) : null}
          {messages && this.state.room ? (
            <div>
              <ul id="messageList">
                {" "}
                {messages
                  .filter((message) => message.roomNumber === this.state.room)
                  .map((message, index) => (
                    <li id={`${setIdOfMessage(message, user)}`} key={index}>
                      {message.content}
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
        </div>
        <p>____________</p>
        <div id="startConvo"></div>
      </div>
    );
  }
}
const mapState = (state) => {
  return {
    user: state.auth,
    messages: state.messages,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getMessages: (user, room) => dispatch(getMessages(user, room)),

    loadInitialData() {
      dispatch(me());
    },
  };
};

export default connect(mapState, mapDispatch)(ContactList);

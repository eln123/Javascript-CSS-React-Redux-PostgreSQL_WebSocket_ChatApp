import { render } from "enzyme";
import React from "react";
import { connect } from "react-redux";
import { clientSideFunc } from "../socket";
import { clientSideJoinRoom } from "../socket/joinRoom";
import { getMessages } from "../store/messages";

/**
 * COMPONENT
 */

const setIdOfMessage = (message, user) => {
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
      selectedContact: {},
      change: false,
    };
    this.selectContact = this.selectContact.bind(this);
  }
  selectContact(contact, e) {
    e.preventDefault();
    this.state.selectedContact = contact;
    this.setState({ ...this.state, change: !this.state.change });
    if (this.state.selectedContact) {
      this.props.getMessages(this.props.user, this.state.selectedContact);
      // clientSideJoinRoom(this.props.user, this.state.selectedContact);
    }
  }
  render() {
    const user = this.props.user;
    const contacts = user.contacts;
    let messages = user.messages;
    if (messages) {
      const roomNumber = `${Math.min(
        user.phoneNumber,
        this.state.selectedContact.phoneNumber
      )}${Math.max(user.phoneNUmber, this.state.selectedContact.phoneNumber)}`;
      messages = messages.filter((message) => {
        message.roomNumber === roomNumber;
        return message;
      });
    }

    return (
      <div>
        <div>
          {contacts ? (
            <ul>
              {" "}
              {contacts.map((contact, index) => (
                <button
                  key={contact.id}
                  onClick={(e) => this.selectContact(contact, e)}
                >
                  {contact.contactName} {contact.id}
                </button>
              ))}
            </ul>
          ) : null}
          {messages ? (
            <ul id="messageList">
              {" "}
              {messages.map((message, index) => (
                <li id={`${setIdOfMessage(message, user)}`} key={index}>
                  {message.content}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <p>____________</p>
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
    getMessages: (user, contact) => dispatch(getMessages(user, contact)),
  };
};

export default connect(mapState, mapDispatch)(ContactList);

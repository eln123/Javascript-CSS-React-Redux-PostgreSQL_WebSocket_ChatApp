import { render } from "enzyme";
import React from "react";
import { connect } from "react-redux";
import { clientSideFunc } from "../socket";
import { clientSideJoinRoom } from "../socket/joinRoom";
import { getMessages } from "../store/messages";
import history from "../history";

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
      selectedRoom: "",
      change: false,
    };
    this.selectContact = this.selectContact.bind(this);
  }
  componentDidMount() {
    const user = this.props.user;
    clientSideFunc(user);
  }

  async selectContact(contact, e) {
    e.preventDefault();
    const user = this.props.user;
    const room = `${Math.min(user.phoneNumber, contact.phoneNumber)}${Math.max(
      user.phoneNumber,
      contact.phoneNumber
    )}`;
    this.state.selectedRoom = room;
    this.setState({ ...this.state, change: !this.state.change });
    history.location.state = `${user.phoneNumber}${contact.phoneNumber}`;
  }
  render() {
    const user = this.props.user;
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
          {messages ? (
            <div>
              <ul id="messageList">
                {" "}
                {messages.map((message, index) => (
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
    getMessages: (user, contact) => dispatch(getMessages(user, contact)),
  };
};

export default connect(mapState, mapDispatch)(ContactList);

import { render } from "enzyme";
import React from "react";
import { connect } from "react-redux";
import { clientSideFunc, displayMessage, displaySentMessage } from "../socket";
import {
  getMostRecentMessage,
  getMostRecentMessageSender,
  getMessagesForContact,
} from "../socket/helper";
import { me } from "../store/auth";
import history from "../history";
import axios from "axios";
const html = require("html-template-tag");

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
      contacts: {},
      contact: {},
      message: "",
      text: "",
      socket: {},
    };
    this.selectContact = this.selectContact.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.props.loadInitialData();
    const user = this.props.user;
    const contacts = user.contacts.map((contact) => {
      contact.room = `${Math.min(
        user.phoneNumber,
        contact.phoneNumber
      )}${Math.max(user.phoneNumber, contact.phoneNumber)}`;
      return contact;
    });
    this.state.contacts = contacts;

    const socket = clientSideFunc(user);
    this.state.socket = socket;

    let temporarySent = [...document.getElementsByClassName("sentTemporary")];
    let temporaryReceived = [
      ...document.getElementsByClassName("receivedTemporary"),
    ];
    if (temporarySent.length) {
      temporarySent.forEach((sent) => sent.remove());
    }
    if (temporaryReceived.length) {
      temporaryReceived.forEach((received) => received.remove());
    }

    history.location.state = user.phoneNumber;
  }
  handleChange(evt) {
    this.setState({
      ...this.state,
      message: evt.target.value,
    });
  }
  handleSubmit(evt, contact) {
    evt.preventDefault();
    const room = this.state.contact.room;
    const contactPhoneNumber = this.state.contact.phoneNumber;
    let textInput = document.getElementById("textInput");
    textInput.value = "";
    const message = this.state.message;

    const user = this.props.user;

    this.state.socket.emit(
      "send-message",
      message,
      room,
      user.phoneNumber,
      contactPhoneNumber
    );
    displaySentMessage(message, user, contact);
  }
  async selectContact(contact, e) {
    e.preventDefault();
    let temporarySent = [...document.getElementsByClassName("sentTemporary")];
    let temporaryReceived = [
      ...document.getElementsByClassName("receivedTemporary"),
    ];
    if (temporarySent.length) {
      temporarySent.forEach((sent) => sent.remove());
    }
    if (temporaryReceived.length) {
      temporaryReceived.forEach((received) => received.remove());
    }

    this.setState({ ...this.state, contact: contact });
    this.state.contact = contact;

    this.props.loadInitialData();
    this.state.socket.emit("join-room", contact.room);
  }

  render() {
    const user = this.props.user;
    const messages = this.props.user.messages;

    let contacts = user.contacts.map((contact) => {
      contact.room = `${Math.min(
        user.phoneNumber,
        contact.phoneNumber
      )}${Math.max(user.phoneNumber, contact.phoneNumber)}`;
      contact.messages = getMessagesForContact(contact, messages);
      contact.mostRecentMessage = getMostRecentMessage(contact);
      contact.mostRecentMessageSender = getMostRecentMessageSender(
        contact,
        user
      );
      return contact;
    });
    if (this.state.contact) console.log("contact", this.state.contact);

    return (
      <div id="contactListOutermostContainer">
        <div id="contactListComponentContainer">
          {contacts ? (
            <ul id="contactContainer">
              <h3 id="contactListHeader">Select contact</h3>{" "}
              {contacts.map((contact, index) => {
                return (
                  <button
                    id="contactButton"
                    type="submit"
                    className="joinButton"
                    key={contact.id}
                    onClick={(e) => this.selectContact(contact, e)}
                  >
                    <h5 id="contactName">{contact.contactName}</h5>
                    <small id="mostRecentMessage">
                      {contact.mostRecentMessageSender}
                      {contact.mostRecentMessage}
                    </small>
                    {/* {messageToDisplay} */}
                  </button>
                );
              })}
            </ul>
          ) : null}
          {this.state.contact ? (
            <div id="messageAndTextFormDiv">
              <div id="headerDivInMessagePanel">
                <h1 id="contactHeaderInMessagePanel">
                  {this.state.contact.contactName}
                </h1>
              </div>
              <ul id="messageList">
                {messages
                  .filter(
                    (message) => message.roomNumber === this.state.contact.room
                  )
                  .map((message, index) => (
                    <li id={`${setIdOfMessage(message, user)}`} key={index}>
                      {message.content}
                    </li>
                  ))}
              </ul>
              <form id="textForm" onSubmit={this.handleSubmit} name={name}>
                <div>
                  <label htmlFor="text">{/* <small>text</small> */}</label>

                  <input
                    id="textInput"
                    name="text"
                    type="text"
                    placeholder="Type something"
                    onChange={this.handleChange}
                  />
                </div>
                <button id="sendButton" type="submit">
                  Send
                </button>
              </form>
            </div>
          ) : null}
        </div>
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
    loadInitialData() {
      dispatch(me());
    },
  };
};

export default connect(mapState, mapDispatch)(ContactList);

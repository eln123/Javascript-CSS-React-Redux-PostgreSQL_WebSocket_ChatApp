import { render } from "enzyme";
import React from "react";
import { connect } from "react-redux";
import { clientSideFunc, displayMessage, displaySentMessage } from "../socket";
import {
  getMostRecentMessage,
  getMostRecentMessageSender,
  getMessagesForContact,
} from "../helperFunctions/mostRecentMessageHelpers";
import { me } from "../store/auth";
import history from "../history";
import axios from "axios";
const html = require("html-template-tag");

/**
 * COMPONENT
 */

export const AddClassToMessage = (message, user) => {
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
      search: "",
    };
    this.selectContact = this.selectContact.bind(this);
    this.searchContact = this.searchContact.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  async componentDidMount() {
    await this.props.loadInitialData();
    const user = this.props.user;
    const contacts = user.contacts.map((contact) => {
      contact.room = `${Math.min(
        user.phoneNumber,
        contact.phoneNumber
      )}${Math.max(user.phoneNumber, contact.phoneNumber)}`;
      return contact;
    });
    this.state.contacts = contacts;

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
    const socket = this.props.socket;
    socket.on("friend-logged-in", async () => {
      console.log("about to load");
      await this.props.loadInitialData();
      console.log("loaded");
      this.setState({ ...this.state });
    });
  }
  componentDidUpdate() {
    const messages = document.getElementById("messageList");
    if (messages) {
      const latestMessage = messages.lastChild;
      if (latestMessage) {
        messages.scrollTo({
          top: latestMessage.offsetTop,
          behavior: "auto",
        });
      }
    }
  }
  handleChange(evt) {
    this.setState({
      ...this.state,
      message: evt.target.value,
    });
  }
  handleSubmit(evt, contact) {
    evt.preventDefault();
    const socket = this.props.socket;
    if (!this.state.message.length) return; // this solves problem of hitting enter with no message typed
    if (!this.state.contact.phoneNumber) return;
    const room = this.state.contact.room;
    const contactPhoneNumber = this.state.contact.phoneNumber;
    let textInput = document.getElementById("textInput");
    textInput.value = "";
    const message = this.state.message;
    this.state.message = ""; // this solves problem of sending a message, but still having that message on state
    // because of its still on state, you can hit enter twice, with no inputValue the second time (nothing typed in the input box)
    // and it will send the message again that was just sent
    const user = this.props.user;

    socket.emit(
      "send-message",
      message,
      room,
      user.phoneNumber,
      contactPhoneNumber
    );

    displaySentMessage(message, user, contact);
  }
  selectContact(contact, e) {
    e.preventDefault();
    const socket = this.props.socket;
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
    socket.emit("join-room", contact.room);
  }

  searchContact(evt) {
    this.setState({
      ...this.state,
      search: evt.target.value,
    });
  }

  render() {
    const user = this.props.user;
    const messages = this.props.user.messages.filter(
      (message) => message.roomNumber === this.state.contact.room
    );

    let contacts = user.contacts.map((contact) => {
      contact.room = `${Math.min(
        user.phoneNumber,
        contact.phoneNumber
      )}${Math.max(user.phoneNumber, contact.phoneNumber)}`;
      contact.messages = getMessagesForContact(
        contact,
        this.props.user.messages
      );
      contact.mostRecentMessage = getMostRecentMessage(contact);
      contact.mostRecentMessageSender = getMostRecentMessageSender(
        contact,
        user
      );
      return contact;
    });

    // contacts = contacts.filter((contact) => contact.messages.length);

    if (this.state.search.length) {
      contacts = contacts.filter((contact) =>
        contact.contactName
          .toLowerCase()
          .includes(this.state.search.toLowerCase())
      );
    }

    return (
      <div id="contactListOutermostContainer">
        <div id="contactListComponentContainer">
          {contacts ? (
            <ul
              style={{
                overflow: "auto",
                textAlign: "center",
                marginLeft: "50px",
                marginRight: "50px",
                marginTop: "20px",
                borderLeft: "2px solid black",
              }}
              id="contactContainer"
            >
              <h3
                style={{
                  fontSize: "25px",
                  fontStyle: "bold",

                  color: "rgb(51, 138, 224)",
                }}
                id="contactListHeader"
              >
                List of contacts
              </h3>{" "}
              <label id="contactListSearchBar" htmlFor="search"></label>
              <input
                style={{ fontSize: 20, height: "2vh" }}
                type="search"
                placeholder="search name"
                id="search"
                onChange={this.searchContact}
              ></input>
              {contacts.map((contact, index) => {
                return (
                  <button
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "white",
                      borderLeft: "none",
                      borderRight: "none",
                      padding: "0 0 0 0",
                      margin: "0 0 0 0",
                      fontSize: "20px",
                      fontStyle: "bold",
                      height: "10vh",
                      alignItems: "start",
                      color: "black",
                    }}
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
                      {contact.loggedIn}
                    </small>
                    {/* {messageToDisplay} */}
                  </button>
                );
              })}
            </ul>
          ) : null}
          {this.state.contact ? (
            <div
              style={{
                flexBasis: "90%",
                flexGrow: "9",
                flexShrink: "1",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "80vh",
                overflowY: "hidden",
                position: "relative",
              }}
            >
              <h1
                style={{
                  position: "absolute",
                  justifySelf: "start",
                  zIndex: "1",
                  top: "5px",
                  width: "70vw",
                  textAlign: "center",
                  marginBottom: "10px",
                  height: "5vh",

                  borderBottom: "1px solid black",
                  overflow: "hidden",
                }}
              >
                {this.state.contact.contactName}
              </h1>

              <ul
                id="messageList"
                style={{
                  overflowY: "auto",
                  width: "70vw",
                  borderRight: "2px solid gray",
                  marginTop: "8vh",
                }}
              >
                {messages.map((message, index) => {
                  let mappedMessage = (
                    <li
                      key={index}
                      className={`${AddClassToMessage(message, user)}`}
                    >
                      {message.content}
                    </li>
                  );

                  return mappedMessage;
                })}
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
    socket: state.socket,
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

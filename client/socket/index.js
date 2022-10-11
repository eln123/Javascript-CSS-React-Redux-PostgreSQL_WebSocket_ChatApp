import socket from "socket.io-client";
const html = require("html-template-tag");
import history from "../history";
import { getUserAgain } from "../store/auth";
import { setIdOfMessage } from "../components/ContactList";

export const setId = (message, user) => {
  if (message.sender === user.phoneNumber) {
    return "sentMessage";
  } else {
    return "receivedMessage";
  }
};

export function displaySentMessage(message, sender, receiver) {
  const messages = document.getElementById("messageList");
  const newMessage = document.createElement("li");

  const className = "sentTemporary";
  newMessage.className = className;
  newMessage.textContent = message;

  messages.append(newMessage);
}

export const helper = (user, contact) => {
  const list = [...document.getElementById("messageList")];
  let messages = user.messages;
  list.forEach((li) => li.remove());
  const appendThis = messages.filter((message) => {
    message.roomNumber === contact.room;
    return message;
  });
};

export const displayMessage = (message) => {
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
};

export const clientSideFunc = (auth) => {
  let clientSocket = socket(auth);

  const joinRoomButtons = [...document.getElementsByClassName("joinButton")];
  const messageInput = document.getElementById("message-input");

  const form = document.getElementById("form");
  const onMessagePage = joinRoomButtons && messageInput && form ? true : false;

  function displayReceivedMessage(message, user, contact) {
    const messages = document.getElementById("messageList");
    const newMessage = document.createElement("li");
    const sender = message.sender;
    const receiver = message.receiver;
    const content = message.content;
    const userPhoneNumber = history.location.state;

    const receivedClass = "receivedTemporary";
    const sentClass = "sentTemporary";

    newMessage.className = receivedClass;
    newMessage.textContent = content;
    messages.append(newMessage);
  }

  clientSocket.on("connect", () => {
    console.log("Connected to server");

    clientSocket.on("receive-message", (message, user, contact) => {
      console.log("received", user);

      displayReceivedMessage(message, user, contact);
    });
  });

  return clientSocket;
};

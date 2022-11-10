import socket from "socket.io-client";
const html = require("html-template-tag");
import history from "../history";
import { getUserAgain } from "../store/auth";
import { setIdOfMessage } from "../components/Dashboard";

export const setId = (message, user) => {
  if (message.sender === user.phoneNumber) {
    return "sentMessage";
  } else {
    return "receivedMessage";
  }
};

export function removeMostRecentClass() {
  let [mostRecentWasASentMessage] = [
    ...document.getElementsByClassName("sentMessageMostRecent"),
  ];

  if (mostRecentWasASentMessage) {
    mostRecentWasASentMessage.classList.remove("sentMessageMostRecent");
  }
  let [mostRecentWasAReceivedMessage] = [
    ...document.getElementsByClassName("receivedMessageMostRecent"),
  ];
  if (mostRecentWasAReceivedMessage) {
    mostRecentWasAReceivedMessage.classList.remove("receivedMessageMostRecent");
  }
}

export function displaySentMessage(message, sender, receiver) {
  const messages = document.getElementById("messageList");
  const newMessage = document.createElement("li");
  const className = "sentTemporary";
  removeMostRecentClass();
  newMessage.classList.add(className, "sentMessageMostRecent");
  newMessage.textContent = message;

  messages.append(newMessage);
  // newMessage.scrollIntoView();
  messages.scrollTo({
    top: newMessage.offsetTop,
    behavior: "auto",
  });
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
    removeMostRecentClass();

    const messages = document.getElementById("messageList");
    const newMessage = document.createElement("li");
    const sender = message.sender;
    const receiver = message.receiver;
    const content = message.content;
    const userPhoneNumber = history.location.state;

    const receivedClass = "receivedTemporary";
    const sentClass = "sentTemporary";
    newMessage.textContent = content;
    newMessage.classList.add(receivedClass);
    messages.append(newMessage);
    const latestMessage = messages.lastChild;
    if (latestMessage) {
      messages.scrollTo({
        top: latestMessage.offsetTop,
        behavior: "auto",
      });
    }
  }

  clientSocket.on("connect", () => {
    console.log("Connected to server");

    clientSocket.on("receive-message", (message, user, contact) => {
      displayReceivedMessage(message, user, contact);
    });

    clientSocket.on("joined-room", (message) => {});

    clientSocket.on("userDoesNotExist", (message) => {
      console.log(message);
      return;
    });
  });

  return clientSocket;
};

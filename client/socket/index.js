import socket from "socket.io-client";
const html = require("html-template-tag");
import history from "../history";
import { getUserAgain } from "../store/auth";
import { setIdOfMessage } from "../components/ContactList";

const socketHTML = `<div>
      
      <small id="id"> </small>
     
      <div id="message-container"></div>
      <form id="form">
        <label for="message-input">Message</label>
        <input type="text" id="message-input" />
        <button type="submit" id="send-button">Send</button>
   
      </form>
    </div>`;

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
  console.log("hi");
  console.log(appendThis);
  // .map((message, index) => (
  //   <li id={`${setIdOfMessage(message, user)}`} key={index}>
  //     {message.content}
  //   </li>
  // ));
  //
  // appendThis.forEach((li) => {
  //   console.log(li);
  //   let message = document.createElement("li");
  //   message.textContent = li;
  //   message.id = setId(message, user);
  //   list.append(message);
  // });
};

export const displayMessage = (message) => {
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
};

export const clientSideFunc = (auth) => {
  let clientSocket = socket(auth);

  if (history.location.pathname === "/conversation") {
    let container = document.getElementById("potentialSocket");
    container.innerHTML = socketHTML;
  } else {
    let container = document.getElementById("potentialSocket");
    container.innerHTML = "";
    return;
  }

  //
  const joinRoomButtons = [...document.getElementsByClassName("joinButton")];
  const messageInput = document.getElementById("message-input");

  const form = document.getElementById("form");
  const onMessagePage = joinRoomButtons && messageInput && form ? true : false;

  // if (onMessagePage) {
  //   form.addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     const message = messageInput.value;
  //     if (message === "") return;
  //     if (history.location.state) {
  //       const midIdx = history.location.state.length / 2;
  //       const user = history.location.state.slice(0, midIdx);
  //       const contact = history.location.state.slice(midIdx);
  //       const room = `${Math.min(user, contact)}${Math.max(user, contact)}`;

  // clientSocket.emit("send-message", message, room, user, contact);
  // displaySentMessage(message, sender, receiver);
  //   messageInput.value = "";
  // }
  // });

  // joinRoomButtons.forEach((button) =>
  //   button.addEventListener("click", (evt) => {
  //     if (history.location.state) {
  //       const midIdx = history.location.state.length / 2;
  //       const sender = history.location.state.slice(0, midIdx);
  //       const receiver = history.location.state.slice(midIdx);
  //       const room = `${Math.min(sender, receiver)}${Math.max(
  //         sender,
  //         receiver
  //       )}`;

  //       clientSocket.emit("join-room", room, displayMessage);
  //     }
  //   })
  // );

  function displayMessage(message) {
    const div = document.createElement("div");
    div.textContent = message;
    document.getElementById("message-container").append(div);
  }

  // function displaySentMessage(message, sender, receiver) {
  //   const messages = document.getElementById("messageList");
  //   const newMessage = document.createElement("li");

  //   const className = "sentTemporary";
  //   newMessage.className = className;
  //   newMessage.textContent = message;

  //   messages.append(newMessage);
  // }

  function displayReceivedMessage(message, user, contact) {
    const messages = document.getElementById("messageList");
    const newMessage = document.createElement("li");
    const sender = message.sender;
    const receiver = message.receiver;
    const content = message.content;
    const userPhoneNumber = history.location.state;
    // console.log(
    //   "userPhoneNumber",
    //   userPhoneNumber,
    //   "receiver",
    //   receiver,
    //   "sender",
    //   sender
    // );
    const receivedClass = "receivedTemporary";
    const sentClass = "sentTemporary";
    // if (receiver === userPhoneNumber) {
    newMessage.className = receivedClass;
    newMessage.textContent = content;
    messages.append(newMessage);
    // } else {
    //   newMessage.className = sentClass;
    //   newMessage.textContent = content;
    //   messages.append(newMessage);
    // }
  }

  /////////////
  clientSocket.on("connect", () => {
    // clientSocket.removeAllListeners();

    console.log("Connected to server");

    clientSocket.on("receive-message", (message, user, contact) => {
      console.log("received", user);

      // helper(user, contact);
      displayReceivedMessage(message, user, contact);

      // this callback function can also
      // be used to show when the message is sent
    });
  });

  return clientSocket;
};

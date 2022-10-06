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

export const clientSideFunc = (auth) => {
  console.log(history);
  const clientSocket = socket(auth);
  if (history.location.pathname === "/contacts") {
    let container = document.getElementById("potentialSocket");
    container.innerHTML = socketHTML;
  } else {
    let container = document.getElementById("potentialSocket");
    container.innerHTML = "";
    return;
  }

  //
  const joinRoomButton = document.getElementById("pleaseWork");
  const messageInput = document.getElementById("message-input");

  const form = document.getElementById("form");
  const onMessagePage = joinRoomButton && messageInput && form ? true : false;

  if (onMessagePage) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageInput.value;
      if (message === "") return;
      if (history.location.state) {
        const midIdx = history.location.state.length / 2;
        const sender = history.location.state.slice(0, midIdx);
        const receiver = history.location.state.slice(midIdx);
        const room = `${Math.min(sender, receiver)}${Math.max(
          sender,
          receiver
        )}`;

        clientSocket.emit("send-message", message, room, sender, receiver);
        displaySentMessage(message, sender, receiver);
        messageInput.value = "";
      }
    });

    joinRoomButton.addEventListener("click", () => {
      if (history.location.state) {
        const midIdx = history.location.state.length / 2;
        const sender = history.location.state.slice(0, midIdx);
        const receiver = history.location.state.slice(midIdx);
        const room = `${Math.min(sender, receiver)}${Math.max(
          sender,
          receiver
        )}`;

        clientSocket.emit("join-room", room, displayMessage);
      }
    });

    function displayMessage(message) {
      const div = document.createElement("div");
      div.textContent = message;
      document.getElementById("message-container").append(div);
    }

    // function displayNewMessage(message, sender, receiver) {
    //   const messages = document.getElementById("messageList");
    //   const newMessage = document.createElement("li");
    //   newMessage.textContent = message;
    //   const midIdx = history.location.state.length / 2;
    //   const me = history.location.state.slice(0, midIdx);
    //   console.log("me", me, "sender ->", sender);
    //   const id = sender === me ? "sentMessage" : "receivedMessage";
    //   newMessage.id = id;
    //   messages.append(message, newMessage);
    // }

    function displaySentMessage(message, sender, receiver) {
      const messages = document.getElementById("messageList");
      const newMessage = document.createElement("li");

      const midIdx = history.location.state.length / 2;
      const me = history.location.state.slice(0, midIdx);

      const id = "sentMessage";
      newMessage.id = id;
      newMessage.textContent = message;
      messages.append(newMessage);
    }

    function displayReceivedMessage(message, sender, receiver) {
      const messages = document.getElementById("messageList");
      const newMessage = document.createElement("li");

      const midIdx = history.location.state.length / 2;
      const me = history.location.state.slice(0, midIdx);
      const id = "receivedMessage";
      if (receiver === me) {
        newMessage.id = id;
        newMessage.textContent = message;
        messages.append(newMessage);
      }
    }

    /////////////
    clientSocket.on("connect", () => {
      console.log("Connected to server");
      const div = document.getElementById("id");
      div.textContent = `The id for this client is: ${clientSocket.id} and the username is ${auth.username}`;

      clientSocket.on("receive-message", (message, sender, receiver) => {
        console.log("received");

        displayReceivedMessage(message, sender, receiver);

        // this callback function can also
        // be used to show when the message is sent
      });
    });
  }
};

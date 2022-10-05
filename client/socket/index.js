import socket from "socket.io-client";
const html = require("html-template-tag");
import history from "../history";

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
      displayMessage(message);
      if (history.location.state) {
        const midIdx = history.location.state.length / 2;
        const sender = history.location.state.slice(0, midIdx);
        const receiver = history.location.state.slice(midIdx);
        const room = `${Math.min(sender, receiver)}${Math.max(
          sender,
          receiver
        )}`;
        console.log(sender);
        clientSocket.emit("send-message", message, room, sender, receiver);
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

    /////////////
    clientSocket.on("connect", () => {
      console.log("Connected to server");
      const div = document.getElementById("id");
      div.textContent = `The id for this client is: ${clientSocket.id} and the username is ${auth.username}`;

      clientSocket.on("receive-message", (message, room) => {
        console.log("received");
        displayMessage(message);
        // this callback function can also
        // be used to show when the message is sent
      });
    });
  }
};

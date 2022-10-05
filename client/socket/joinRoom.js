import socket from "socket.io-client";
const html = require("html-template-tag");
import history from "../history";

const socketHTML = `<div>
     
      <div id="message-container"></div>
      <form id="form">
        <label for="message-input">Message</label>
        <input type="text" id="message-input" />
        <button type="submit" id="send-button">Send</button>
      </form>
    </div>`;

export const clientSideJoinRoom = (user, room, isTrue) => {
  const clientSocket = socket(user);
  if (!true) {
    return;
  }
  if (isTrue) {
    let container = document.getElementById("messageSocket");
    container.innerHTML = socketHTML;
    clientSocket.emit("join-room", room);
  } else {
    let container = document.getElementById("messageSocket");
    container.innerHTML = "";
    return;
  }

  //

  const messageInput = document.getElementById("message-input");

  const form = document.getElementById("form");
  const onMessagePage = messageInput && room && form ? true : false;

  if (onMessagePage) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageInput.value;

      if (message === "") return;
      displayMessage(message);
      clientSocket.emit("send-message", message, room);
      messageInput.value = "";
    });

    const joinRoomButton = document.getElementById("startConvo");

    joinRoomButton.addEventListener("click", () => {
      console.log(room);
      clientSocket.emit("join-room", room, displayMessage);
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
      div.textContent = `The id for this client is: ${clientSocket.id} and the username is ${client.username}`;

      const timeHeader = document.getElementById("time");

      clientSocket.on("time-change", (time) => {
        timeHeader.innerText = time;
      });
      clientSocket.on("receive-message", (message, room) => {
        console.log("received");
        displayMessage(message);
        // this callback function can also
        // be used to show when the message is sent
      });
    });
  }
};

import socket from "socket.io-client";
const html = require("html-template-tag");
import history from "../history";

const socketHTML = `<div>
      <h1>Time:</h1>
      <h2 id="time"></h2>

      <p>______________</p>
      <small id="id"> </small>
      <p>______________</p>
      <title>Trying to Use Socket</title>
      <div id="message-container"></div>
      <form id="form">
        <label for="message-input">Message</label>
        <input type="text" id="message-input" />
        <button type="submit" id="send-button">Send</button>
        <label for="room-input">Room</label>
        <input type="text" id="room-input" />
        <button type="button" id="room-button">Join</button>
      </form>
    </div>`;

export const clientSideFunc = (auth) => {
  console.log(auth);
  const clientSocket = socket(auth);
  if (history.location.pathname === "/message") {
    let container = document.getElementById("potentialSocket");
    container.innerHTML = socketHTML;
  } else {
    let container = document.getElementById("potentialSocket");
    container.innerHTML = "";
    return;
  }

  //
  const joinRoomButton = document.getElementById("room-button");
  const messageInput = document.getElementById("message-input");
  const roomInput = document.getElementById("room-input");
  const form = document.getElementById("form");
  const onMessagePage =
    joinRoomButton && messageInput && roomInput && form ? true : false;

  if (onMessagePage) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageInput.value;
      const room = roomInput.value;

      if (message === "") return;
      displayMessage(message);
      clientSocket.emit("send-message", message, room);
      messageInput.value = "";
    });

    joinRoomButton.addEventListener("click", () => {
      const room = roomInput.value;
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
      div.textContent = `The id for this client is: ${clientSocket.id} and the username is ${auth.username}`;

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

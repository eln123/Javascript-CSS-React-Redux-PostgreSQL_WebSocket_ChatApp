export const helper = (messages, user, contact) => {
  const list = [...document.getElementById("messageList")];

  list.forEach((li) => li.remove());
  const appendThis = messages
    .filter((message) => message.roomNumber === contact.room)
    .map((message, index) => (
      <li id={`${setIdOfMessage(message, user)}`} key={index}>
        {message.content}
      </li>
    ));
  appendThis.forEach((li) => list.append(li));
};

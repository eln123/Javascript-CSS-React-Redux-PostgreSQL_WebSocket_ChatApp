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

export const getMessagesForContact = (contact, messages) => {
  let contactMessages = [];
  for (let i = 0; i < messages.length; i++) {
    let message = messages[i];
    if (
      message.sender === contact.phoneNumber ||
      message.receiver === contact.phoneNumber
    ) {
      contactMessages.push(message);
    }
  }
  return contactMessages;
};

export const getMostRecentMessage = (contact) => {
  let messages = contact.messages.map((message) => message.content);
  if (!messages) return "";
  let mostRecentMessage = messages[messages.length - 1];
  return mostRecentMessage;
};

export const getMostRecentMessageSender = (contact, user) => {
  let messageSenders = contact.messages.map((message) => message.sender);
  if (!messageSenders.length) return "";
  let mostRecentMessageSender = messageSenders[messageSenders.length - 1];
  if (mostRecentMessageSender === user.phoneNumber) {
    return "You: ";
  } else {
    return `${contact.contactName}: `;
  }
};

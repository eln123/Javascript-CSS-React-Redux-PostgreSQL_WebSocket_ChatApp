const html = require("html-template-tag");

export const replaceReact = () => html`<div>
  <div id="replace-react-container"></div>
  <form id="form">
    <label for="message-input">Message</label>
    <input type="text" id="message-input" />
    <button type="submit" id="send-button">Send</button>
  </form>
</div>`;

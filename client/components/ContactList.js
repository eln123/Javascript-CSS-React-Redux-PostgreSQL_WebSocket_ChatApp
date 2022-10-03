import { render } from "enzyme";
import React from "react";
import { connect } from "react-redux";
import { clientSideFunc } from "../socket";

/**
 * COMPONENT
 */
export class ContactList extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { username, contacts } = this.props;

    return (
      <div>
        {contacts ? (
          <ul>
            {" "}
            {contacts.map((contact, index) => (
              <li id="contact" key={index}>
                {contact.contactName}{" "}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }
}
const mapState = (state) => {
  return {
    username: state.auth.username,
    contacts: state.auth.contacts,
    messages: state.auth.messages,
  };
};

export default connect(mapState)(ContactList);

import React from "react";
import { connect } from "react-redux";
import { createNewContact } from "../store/contact";

class AddContact extends React.Component {
  constructor() {
    super();
    this.state = {
      contactName: "",
      phoneNumber: "",
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  submitHandler(event) {
    event.preventDefault();
    const userPhoneNumber = this.props.user.phoneNumber;
    this.props.createNewContact(
      this.state.contactName,
      this.state.phoneNumber,
      userPhoneNumber
    );
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div>
        <h1>Create new contact:</h1>
        <form onSubmit={this.submitHandler}>
          <label>Name:</label>
          <input
            value={this.state.contactName}
            type="text"
            name="name"
            onChange={this.handleChange}
          ></input>
          <label>PhoneNumber:</label>
          <input
            value={this.state.phoneNumber}
            type="text"
            name="phoneNumber"
            onChange={this.handleChange}
          ></input>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    user: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    createNewContact: (contact) => dispatch(createNewContact(contact)),
  };
};

export default connect(mapState, mapDispatch)(AddContact);

import React from "react";
import { connect } from "react-redux";
import { setSocketOntoRedux } from "../store/socket";
// import { createNewContact } from "../store/contact";

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
  componentDidMount() {
    const socket = this.props.socket;
    socket.on("contact-added", (message) => console.log(message));
  }
  submitHandler(event) {
    event.preventDefault();
    const userPhoneNumber = this.props.user.phoneNumber;
    let contactNameInput = document.getElementById("contactNameInput");
    contactNameInput.value = "";
    let phoneNumberInput = document.getElementById("phoneNumberInput");
    phoneNumberInput.value = "";

    const socket = this.props.socket;
    if (this.state.phoneNumber.length > 10) return;
    socket.emit(
      "addContact",
      userPhoneNumber,
      this.state.contactName,
      this.state.phoneNumber
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
            id="contactNameInput"
            value={this.state.contactName}
            type="text"
            name="contactName"
            onChange={this.handleChange}
          ></input>
          <label>PhoneNumber:</label>
          <input
            id="phoneNumberInput"
            value={this.state.phoneNumber}
            type="number"
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
    socket: state.socket,
  };
};

const mapDispatch = (dispatch) => {
  return {
    // createNewContact: (contact) => dispatch(createNewContact(contact)),
  };
};

export default connect(mapState, mapDispatch)(AddContact);

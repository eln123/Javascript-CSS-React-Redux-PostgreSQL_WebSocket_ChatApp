import React from "react";
import { connect } from "react-redux";
import { setSocketOntoRedux } from "../store/socket";
// import { createNewContact } from "../store/contact";
import history from "../history";
import { me } from "../store/auth";

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
  async submitHandler(event) {
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
    await this.props.loadInitialData();
    history.push("/conversation");
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div
        style={{
          height: "80vh",
          width: "50vw",
          borderRadius: "10px",
          border: "1px solid black",
          position: "absolute",
          left: "50%",
          top: "10%",
          transform: "translateX(-50%)",
          backgroundColor: "whiteSmoke",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Create new contact:</h1>
        <form
          style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            height: "90%",
            width: "100%",

            justifyContent: "start",
            fontSize: "24px",
          }}
          onSubmit={this.submitHandler}
        >
          <label style={{ textAlign: "center" }}>Name</label>
          <input
            style={{
              padding: "5px",
              border: "1px solid black",
              width: "20vw",
              alignSelf: "center",
            }}
            id="contactNameInput"
            value={this.state.contactName}
            type="text"
            name="contactName"
            onChange={this.handleChange}
          ></input>
          <label style={{ textAlign: "center" }}>PhoneNumber</label>
          <input
            style={{
              padding: "5px",
              border: "1px solid black",
              width: "20vw",
              alignSelf: "center",
            }}
            id="phoneNumberInput"
            value={this.state.phoneNumber}
            type="text"
            name="phoneNumber"
            onChange={this.handleChange}
          ></input>
          <input
            style={{
              padding: "10px",
              border: "1px solid black",
              marginTop: "10px",
              color: "white",
              fontSize: "28px",
              width: "33vw",
              alignSelf: "center",
              backgroundColor: "rgb(51, 138, 224)",
            }}
            type="submit"
            value="Submit"
          />
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
    loadInitialData() {
      dispatch(me());
    },
  };
};

export default connect(mapState, mapDispatch)(AddContact);

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

const Navbar = ({ handleClick, isLoggedIn, username }) => {
  return (
    <div>
      <nav>
        {isLoggedIn ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingRight: "50px",
              paddingLeft: "70px",
              fontSize: "1.5vh",
              color: "white",
            }}
          >
            <h1>Welcome, {username}! </h1>
            <div style={{ alignSelf: "center" }}>
              <Link id="navLink" to="/addContact">
                Add Contact
              </Link>
              <Link id="navLink" to="/dashboard">
                Dashboard
              </Link>
              <a id="logoutLink" href="#" onClick={handleClick}>
                Logout
              </a>
            </div>
          </div>
        ) : (
          <div id="navBarFlex">
            <Link id="navLink" to="/login">
              Login
            </Link>
          </div>
        )}
      </nav>
      <hr />
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    username: state.auth.username,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);

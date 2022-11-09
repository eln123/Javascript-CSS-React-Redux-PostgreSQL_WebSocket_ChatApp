import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

const Navbar = ({ handleClick, isLoggedIn, id }) => {
  return (
    <div>
      <nav>
        {isLoggedIn ? (
          <div id="navBarFlex">
            <Link id="navLink" to="/addContact">
              Add Contact page
            </Link>
            <Link id="navLink" to="/conversation">
              Conversation
            </Link>
            <a id="logoutLink" href="#" onClick={handleClick}>
              Logout
            </a>
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
    id: state.auth.id,
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

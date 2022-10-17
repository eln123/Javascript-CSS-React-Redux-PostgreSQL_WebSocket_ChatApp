import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store";

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div>
    <nav>
      {isLoggedIn ? (
        <div>
          <a id="logoutLink" href="#" onClick={handleClick}>
            Logout
          </a>
          <Link id="navLink" to="/addContact">
            Add Contact page
          </Link>
          <Link id="navLink" to="/converation">
            Conversation
          </Link>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link id="navLink" to="/login">
            Login
          </Link>
          <Link to="/addContact">Add Contact page</Link>
          <Link to="/converation">Conversation</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
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

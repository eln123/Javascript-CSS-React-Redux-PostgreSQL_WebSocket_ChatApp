import axios from "axios";
import history from "../history";

const TOKEN = "token";

/**
 * ACTION TYPES
 */

const SET_MESSAGES = "SET_MESSAGES";
const SET_USER = "SET_USER";

/**
 * ACTION CREATORS
 */

const setMessages = (messages) => ({ type: SET_MESSAGES, messages });
const setUser = (user) => ({ type: SET_USER, user });

/**
 * THUNK CREATORS
 */

export const getMessages = (user, contact) => async (dispatch) => {
  try {
    const roomName = `${Math.min(
      user.phoneNumber,
      contact.phoneNumber
    )}${Math.max(user.phoneNumber, contact.phoneNumber)}`;
    const res = await axios.get(`/api/users/${user.phoneNumber}/${roomName}`);
    const user = res.data;
    const messages = res.data.messages;

    dispatch(setUser(user));
  } catch (err) {
    return err;
  }
};

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    case SET_MESSAGES:
      return action.messages;
    default:
      return state;
  }
}

import axios from "axios";
import history from "../history";

const TOKEN = "token";

/**
 * ACTION TYPES
 */
const SET_AUTH = "SET_AUTH";

/**
 * ACTION CREATORS
 */
const setAuth = (auth) => ({ type: SET_AUTH, auth });

/**
 * THUNK CREATORS
 */
export const me = () => async (dispatch) => {
  const token = window.localStorage.getItem(TOKEN);
  if (token) {
    const res = await axios.get("/auth/me", {
      headers: {
        authorization: token,
      },
    });
    return dispatch(setAuth(res.data));
  }
};

export const authenticate =
  (username, password, method) => async (dispatch) => {
    try {
      const res = await axios.post(`/auth/${method}`, { username, password });
      window.localStorage.setItem(TOKEN, res.data.token);
      dispatch(me());
    } catch (authError) {
      return dispatch(setAuth({ error: authError }));
    }
  };

export const logout = () => {
  window.localStorage.removeItem(TOKEN);
  history.push("/login");
  return {
    type: SET_AUTH,
    auth: {},
  };
};

/**
 * ACTION TYPES
 */

const SET_UPDATED = "SET_UPDATED";

/**
 * ACTION CREATORS
 */

const setUpdatedUser = (updatedUser) => ({ type: SET_UPDATED, updatedUser });

/**
 * THUNK CREATORS
 */

export const getMessages = (userId, room) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/users/${userId}/${room}`);
    console.log(res);
    const updatedUser = res.data;
    dispatch(setUpdatedUser(updatedUser));
  } catch (err) {
    return err;
  }
};

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_UPDATED:
      return action.user;
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}

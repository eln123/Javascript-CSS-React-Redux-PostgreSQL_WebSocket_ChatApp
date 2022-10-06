import axios from "axios";
import history from "../history";

const TOKEN = "token";

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
      return action.updatedUser;
    default:
      return state;
  }
}

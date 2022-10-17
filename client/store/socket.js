import axios from "axios";
import history from "../history";

const TOKEN = "token";

/**
 * ACTION TYPES
 */

const SET_SOCKET = "SET_SOCKET";

/**
 * ACTION CREATORS
 */

export const setSocketOntoRedux = (socket) => {
  return {
    type: SET_SOCKET,
    socket,
  };
};

/**
 * THUNK CREATORS
 */

export const setSocket = (socket) => {
  return async function (dispatch) {
    console.log("dispatching socket", socket);
    dispatch(setSocketOntoRedux(socket));
  };
};

/**
 * REDUCER
 */
export default function (state = {}, action) {
  switch (action.type) {
    case SET_SOCKET:
      console.log("socket dispatched", action.socket);
      return action.socket;
    default:
      return state;
  }
}

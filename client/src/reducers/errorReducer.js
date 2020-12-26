import { GET_ERRORS } from '../actions/types';

const initialState = {};

// eslint-disable-next-line  
  export default function (state = initialState, action) {
    // Test Validity:
    switch (action.type) {
      case GET_ERRORS:
          return action.payload;
      default:
        return state;
    }
  }
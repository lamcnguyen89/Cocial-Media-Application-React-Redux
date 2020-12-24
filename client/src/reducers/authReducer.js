const initialState = {
  isAuthenticated: false,
  user: {},
};

export default function (state = initialState, action) {
  // Test Validity:
  switch (action.type) {
    default:
      return state;
  }
}

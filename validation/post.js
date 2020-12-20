// File where we create the rules for when the user uploads a new post:

// File where we create the rules for registering a new user

const isEmpty = require("./is-empty");

const Validator = require("validator");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

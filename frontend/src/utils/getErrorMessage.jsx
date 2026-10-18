const getErrorMessage = (error) => {
  const errorData = error?.response?.data;

  if (!errorData) {
    return "Unable to connect to the server.";
  }

  // Example: { message: ["Invalid username or password."] }
  if (Array.isArray(errorData.message) && errorData.message.length) {
    return errorData.message[0];
  }

  // Example: { message: "Invalid username or password." }
  if (typeof errorData.message === "string") {
    return errorData.message;
  }

  // Example: { detail: "Invalid credentials." }
  if (typeof errorData.detail === "string") {
    return errorData.detail;
  }

  // Example: { non_field_errors: ["Invalid credentials."] }
  if (
    Array.isArray(errorData.non_field_errors) &&
    errorData.non_field_errors.length
  ) {
    return errorData.non_field_errors[0];
  }

  // Example:
  // {
  //   username: ["Username already exists."],
  //   email: ["Email already exists."]
  // }
  const firstField = Object.keys(errorData)[0];

  if (firstField) {
    const fieldValue = errorData[firstField];

    if (Array.isArray(fieldValue) && fieldValue.length) {
      return fieldValue[0];
    }

    if (typeof fieldValue === "string") {
      return fieldValue;
    }
  }

  return "Something went wrong. Please try again.";
};

export default getErrorMessage;
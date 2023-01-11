class MyApiError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class ValidationError extends MyApiError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class WrongParamaetrsError extends MyApiError {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}
class NotAutorizedError extends MyApiError {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}
class RegistrationConflictError extends MyApiError {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

module.exports = {
  MyApiError,
  RegistrationConflictError,
  ValidationError,
  WrongParamaetrsError,
  NotAutorizedError,
};

const ErrorResponse = require("../utils/error");
exports.errorHandling = async (err, req, res, next) => {
  let error = { ...err };
  console.log(err);
  console.log(error.name);
  console.log(error.message);

  if (err.name === "ValidationError") {
    console.log(error.value);
  }

  res.status(400).json({
    data: err.message,
  });
};

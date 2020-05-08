const mongoose = require("mongoose");

exports.db = () => {
  mongoose.connect(process.env.MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

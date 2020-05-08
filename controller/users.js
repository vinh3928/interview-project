const User = require("../model/User");

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.json({ success: true, data: users });
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      sucesss: true,
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

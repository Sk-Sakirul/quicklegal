const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
};

module.exports = authenticate;

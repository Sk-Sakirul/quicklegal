const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

// Register new user
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({
        success: false,
        message: "User already exists with the same email! please try again",
      });

    const user = await User.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "Registration successful"
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exists! Please register first",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    let token = generateToken(user._id, user.role);

     res
       .cookie("token", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
       })
       .json({
         success: true,
         message: "Logged in successfully",
         token,
         user: {
           name: user.name,
           email: user.email,
           role: user.role,
           id: user._id,
         },
       });
  } catch (error) {
    next(error);
  }
};

// Get logged-in user profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout
const logout = (req, res) => {
    res.clearCookie("token").json({
      success: true,
      message: "Logged out successfully",
    });
};

module.exports = { register, login, getProfile, logout };
// Importing necessary modules and models
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Signup function to create a new user
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // Hashing the password before storing it
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    // Saving the new user to the database
    await newUser.save();
    res.status(201).json("User created successfully!");
  } catch (error) {
    next(error); // Passes the error to error-handling middleware
  }
};

// Signin function to authenticate an existing user
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Finding user by email
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    
    // Validating the password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));
    
    // Generating a JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    // Excluding the password from the response
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true }) // Setting token as an HTTP-only cookie
      .status(200)
      .json(rest); // Returning the user data except for the password
  } catch (error) {
    next(error);
  }
};

// Google sign-in function to authenticate or register users via Google
export const google = async (req, res, next) => {
  try {
    // Checking if the user already exists in the database
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // Generate JWT for existing user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // If new user, generate a random password and hash it
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      // Creating a new user with Google data
      const newUser = new User({
        username:
          req.body.name.split("").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      
      // Generate JWT for new user
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// Signout function to log out the user
export const signout = async (req, res, next) => {
  try {
    // Clearing the authentication cookie
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};


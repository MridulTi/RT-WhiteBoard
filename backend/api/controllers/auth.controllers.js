// Import dependencies and modules
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { oauth2client } from "../utils/utils.js";

// Sign token function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

// Create and send cookie function
const createSendToken = (user,accessToken, statusCode, res) => {
  const token = signToken(user.id);
  console.log("TOKEN: ",token)

  const cookieOptions = {
    httpOnly: true,
    // path: "/",
    secure: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
  };

  user.password = undefined;

  return res.status(200).cookie("jwt", token, cookieOptions).json({
    message: "success",
    token,
    data: {
      accessToken,
      user,
    },
  });
};

// Google Authentication handler
const googleAuth = asyncHandler(async (req, res, next) => {
  const code = req.query.code;
  console.log("USER CREDENTIAL -> ", code);

  const googleRes = await oauth2client.getToken(code);
  oauth2client.setCredentials(googleRes.tokens);

  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );
  console.log(userRes.data)
  console.log(googleRes.scopes)
  let user = await User.findOne({ email: userRes.data.email });

  if (!user) {
    console.log("New User found");
    user = await User.create({
      name: userRes.data.name,
      email: userRes.data.email,
      image: userRes.data.picture,
    });
  }

  createSendToken(user,googleRes.tokens.access_token, 201, res);
});

export default googleAuth;

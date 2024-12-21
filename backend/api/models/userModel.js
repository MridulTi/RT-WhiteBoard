import mongoose from "mongoose";

const userSchemas = new mongoose.Schema({
  name: String,
  email: String,
  image: String,

});

export const User= new mongoose.model("User", userSchemas);

const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require("validator");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("This is invalid emai");
        }
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw Error("gender is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "This is about user details",
    },
    photoUrl: {
      type: String,
      validate(value) {
        // Allow empty/null values or local file paths or valid URLs
        if (value && value.startsWith("/uploads/")) {
          return true; // Local file path is valid
        }
        if (value && !validator.isURL(value)) {
          throw Error("Photo URL must be a valid URL or local file path");
        }
      },
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { strict: false, timestamps: true },
);
let userModel = model("User", userSchema);
module.exports = userModel;

/* 

type:true,
required:true,
unique:true
lowercase:true,
uppercase:true,
get and set method(arrow function)
trim:true
minLength:4,
maxLength:6,
max:6,
min:5,
validate(value){   ==>it is work for new doc. ==>patch work if turn on runvalidators
}


{timestamps:true}

*/

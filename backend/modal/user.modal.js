const mongoose = require("mongoose");

const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    hash_password: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    salt: String,
    city: {
      type: String,
    },
    zipCode: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hash_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) {
      return "";
    } else {
      try {
        return crypto
          .createHmac("sha256", this.salt)
          .update(password)
          .digest("hex");
      } catch (error) {
        return "";
      }
    }
  },
  authenticate: function (password) {
    return this.encryptPassword(password) === this.hash_password;
  },
};

module.exports = mongoose.model("Auth", userSchema);

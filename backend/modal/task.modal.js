const mongoose = require("mongoose");

const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", taskSchema);

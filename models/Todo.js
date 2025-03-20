const { date } = require("joi");
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    filter: {
      type: String,
      enum: ["archive", "hidden", "visible"],
      default: "visible"
    },
    sequenceNumber: {
      type: Number
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    deadline: {
      type: Date
    },
    isDeleted: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Todo", todoSchema);

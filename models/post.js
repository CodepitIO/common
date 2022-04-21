"use strict";

require("./user");

const mongoose = require("mongoose");
const CollectionCounter = require("./collection_counter");
const Joi = require("joi");

const ObjectId = mongoose.Schema.Types.ObjectId;

let schema = mongoose.Schema(
  {
    _id: { type: Number, min: 1 },
    author: {
      type: ObjectId,
      ref: "User",
    },
    title: String,
    body: String,
    blog: String,
    published: {
      type: Boolean,
      default: false,
    },
    publishAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ id: 1 });
schema.index({ author: 1, createdAt: -1 });
schema.index({ page: 1, createdAt: -1 });

schema.statics.validate = function (obj) {
  return Joi.object({
    title: Joi.string().min(1).max(100).required(),
    body: Joi.string().min(1).max(2000).required(),
    author: Joi.string().min(1).max(100).required(),
    blog: Joi.string().min(1).max(100).optional(),
  }).validate(obj);
};

schema.pre("save", async function () {
  await CollectionCounter.setIncrementalId(this, "Post");
});

module.exports = mongoose.model("Post", schema);

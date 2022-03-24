"use strict";

const mongoose = require("mongoose");

var schema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

schema.statics.getNextId = async function (collectionName) {
  const ret = await this.findByIdAndUpdate(
    collectionName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return ret.seq;
};

schema.statics.setIncrementalId = async function (document, collectionName) {
  if (document.$isNew) {
    document._id = await this.getNextId(collectionName);
  }
};

const CollectionCounter = mongoose.model("CollectionCounter", schema);
module.exports = CollectionCounter;

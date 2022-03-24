"use strict";

require("./problem");
require("./contest");
require("./user");

const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const ValidateChain = require("../lib/utils").validateChain,
  Constants = require("../constants"),
  CollectionCounter = require("./collection_counter");

let schema = mongoose.Schema({
  _id: { type: Number, min: 1 },
  contest: { type: ObjectId, ref: "Contest" },
  contestant: { type: ObjectId, ref: "User" },
  rep: ObjectId,

  problem: { type: ObjectId, ref: "Problem" },
  code: String,
  language: String,

  date: { type: Date, default: Date.now },
  verdict: { type: Number, default: 0 },
  oj_id: { type: Number, default: -1 },
});

schema.index({ id: 1 });
schema.index({ contest: 1, contestant: 1, date: -1 });
schema.index({ contest: 1, rep: 1, date: -1 });
schema.index({ contest: 1, rep: 1, problem: 1, date: -1 });
schema.index({ date: 1 });

schema.statics.validateChain = ValidateChain({
  language: function () {
    this.notEmpty().isIn(Constants.LANGUAGES);
  },
  code: function () {
    this.notEmpty().isByteLength({ min: 1, max: 64 * 1024 });
  },
});

schema.pre("save", async function () {
  await CollectionCounter.setIncrementalId(this, "Submission");
});

module.exports = mongoose.model("Submission", schema);

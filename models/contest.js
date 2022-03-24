"use strict";

require("./user");
require("./team");

const mongoose = require("mongoose"),
  _ = require("lodash");

const ObjectId = mongoose.Schema.Types.ObjectId;

let contestantSchema = mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    team: {
      type: ObjectId,
      ref: "Team",
    },
  },
  { _id: false }
);

let schema = mongoose.Schema(
  {
    name: String,

    author: {
      type: ObjectId,
      ref: "User",
    },

    date_start: Date,
    date_end: Date,

    frozen_time: Date,
    blind_time: Date,

    problems: [
      {
        type: ObjectId,
        ref: "Problem",
      },
    ],

    contestants: [contestantSchema],

    contestantType: {
      type: Number,
      default: 3,
    },
    password: {
      type: String,
      default: "",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    watchPrivate: {
      type: Boolean,
      default: false,
    },
    languages: [String],
  },
  {
    timestamps: true,
  }
);

schema.index({ date_start: -1 });
schema.index({ date_end: -1 });
schema.index({ author: 1, createdAt: -1 });
schema.index({ "contestants.user": 1, date_start: -1 });
schema.index({ "contestants.user": 1, date_end: -1 });
schema.index({ "contestants.user": 1, _id: 1 });
schema.index({ "contestants.team": 1, "contestants.user": 1, _id: 1 });

schema.methods.getUserRepresentative = function (user) {
  let id = (user?._id && _.toString(user._id)) || _.toString(user);
  let elem = _.find(this.contestants, function (obj) {
    return obj.user && _.toString(obj.user) === id;
  });
  return elem && (elem.team || elem.user);
};

schema.methods.userInContest = function (user) {
  let id = (user?._id && _.toString(user._id)) || _.toString(user);
  return _.some(this.contestants, (obj) => {
    let uid = obj.user?._id ?? obj.user;
    return _.toString(uid) === id;
  });
};

schema.methods.problemInContest = function (problem) {
  let id =
    (problem && problem._id && _.toString(problem._id)) || _.toString(problem);
  return _.some(this.problems, (obj) => {
    return _.toString(obj) === _.toString(id);
  });
};

schema.methods.isAuthor = function (user) {
  let id = (user && user._id && _.toString(user._id)) || _.toString(user);
  return this.author.toString() === id;
};

schema.methods.hasStarted = function () {
  return this.date_start <= new Date();
};

schema.methods.hasEnded = function () {
  return this.date_end <= new Date();
};

module.exports = mongoose.model("Contest", schema);

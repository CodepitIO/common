"use strict";

const mongoose = require("mongoose");
const Utils = require("../lib/utils");

let problemSchema = mongoose.Schema(
  {
    id: String,
    sid: String, // substitute id for the problem
    name: String,
    oj: String,
    url: String,
    originalUrl: String,
    fullName: String,
    imported: {
      type: Boolean,
      default: false,
    },
    importTries: {
      type: Number,
      default: 0,
    },
    importDate: Date,
    source: String,
    timelimit: Number,
    memorylimit: String,
    inputFile: String,
    outputFile: String,
    isPdf: {
      type: Boolean,
      default: false,
    },
    stmtLanguage: {
      type: String,
      default: "english",
    },
    supportedLangs: [String],
  },
  {
    timestamps: true,
  }
);

problemSchema.index(
  {
    oj: 1,
    id: 1,
  },
  {
    unique: true,
  }
);

problemSchema.index({
  originalUrl: 1,
});

problemSchema.index({ originalUrl: 1 });

problemSchema.post("save", (problem, next) => {
  if (problem.fullName && problem.url && problem.originalUrl) return next();
  let oj = problem.oj;
  let id = problem.id;
  let name = problem.name;
  const OJConfig = Utils.getOJConfig(oj);
  problem.fullName = "[" + OJConfig.name + " " + id + "] " + name;
  if (!problem.url) {
    problem.url = OJConfig.url + OJConfig.getProblemPath(id);
  }
  if (!problem.originalUrl) {
    if (problem.isPdf) {
      problem.originalUrl = OJConfig.url + OJConfig.getProblemPdfPath(id);
    } else {
      problem.originalUrl = OJConfig.url + OJConfig.getProblemPath(id);
    }
  }
  problem.save(next);
});

module.exports = mongoose.model("Problem", problemSchema);

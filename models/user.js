"use strict";

const mongoose = require("mongoose"),
  crypto = require("crypto");

const ValidateChain = require("../lib/utils").validateChain;

const ObjectId = mongoose.Schema.Types.ObjectId;

const ACCESS = require("../constants").SITE_VARS.ACCESS;

// define the schema for our user model
let schema = mongoose.Schema(
  {
    local: {
      username: String,
      name: String,
      surname: String,
      email: String,
      password: {
        hash: String,
        salt: String,
      },
      salt: String,
      verified: { type: Boolean, default: false },
      verifyHash: String,
      lastAccess: { type: Date, default: Date.now },
    },
    access: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

schema.index({ "local.username": 1 }, { unique: true });
schema.index({ "local.email": 1 }, { unique: true });

schema.statics.validateChain = ValidateChain({
  name: function () {
    this.notEmpty().isLength({ min: 1, max: 100 });
  },
  surname: function () {
    this.notEmpty().isLength({ min: 1, max: 100 });
  },
  username: function () {
    this.notEmpty().isLength({ min: 1, max: 30 });
  },
  email: function () {
    this.notEmpty().isLength({ min: 1, max: 100 });
  },
  password: function () {
    this.notEmpty().isLength({ min: 1, max: 100 });
  },
});

schema.statics.generatePassword = function (text) {
  let salt = crypto.randomBytes(128).toString("base64");
  let hash = crypto.pbkdf2Sync(text, salt, 100000, 64, "sha512");
  return {
    salt: salt,
    hash: hash,
  };
};

schema.methods.validPassword = function (text) {
  return (
    this.local.password.hash ==
    crypto.pbkdf2Sync(text, this.local.password.salt, 100000, 64, "sha512")
  );
};

schema.virtual("local.fullName").get(function () {
  if (!this.local.surname) return this.local.name;
  return `${this.local.name} ${this.local.surname}`;
});

schema.virtual("isAdmin").get(function () {
  return this.access >= ACCESS.ADMIN;
});

schema.virtual("local.emailHash").get(function () {
  return (
    (this.local.email &&
      crypto
        .createHash("md5")
        .update(this.local.email.toLowerCase())
        .digest("hex")) ||
    ""
  );
});

schema.set("toObject", {
  transform: function (doc, ret, options) {
    delete ret.local.verifyHash;
    return ret;
  },
});

module.exports = mongoose.model("User", schema);

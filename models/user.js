const mongoose = require(`mongoose`);
const crypto = require(`crypto`);

const ValidateChain = require(`../lib/utils`).validateChain;

const { ObjectId } = mongoose.Schema.Types;

const { ACCESS } = require(`../constants`).SITE_VARS;

// define the schema for our user model
const schema = mongoose.Schema(
  {
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: {
      hash: String,
      salt: String,
    },
    country: {
      value: String,
      label: String,
      imageUrl: String,
    },
    verified: { type: Boolean, default: false },
    verifyHash: String,
    lastAccess: { type: Date, default: Date.now },
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

schema.index({ username: 1 }, { unique: true });
schema.index({ email: 1 }, { unique: true });

schema.statics.validateChain = ValidateChain({
  firstName() {
    this.notEmpty().isLength({ min: 1, max: 50 });
  },
  lastName() {
    this.notEmpty().isLength({ min: 1, max: 50 });
  },
  username() {
    this.notEmpty().isLength({ min: 1, max: 50 });
  },
  email() {
    this.notEmpty().isLength({ min: 1, max: 100 });
  },
  emailOrUsername() {
    this.notEmpty().isLength({ min: 1, max: 100 });
  },
  password() {
    this.notEmpty().isLength({ min: 1, max: 100 });
  },
});

schema.statics.generatePassword = function (text) {
  const salt = crypto.randomBytes(128).toString(`base64`);
  const hash = crypto.pbkdf2Sync(text, salt, 100000, 64, `sha512`);
  return {
    salt,
    hash,
  };
};

schema.methods.validPassword = function (text) {
  return (
    this.password.hash ==
    crypto.pbkdf2Sync(text, this.password.salt, 100000, 64, `sha512`)
  );
};

schema.virtual(`fullName`).get(function () {
  if (!this.lastName) return this.firstName;
  return `${this.firstName} ${this.lastName}`;
});

schema.virtual(`isAdmin`).get(function () {
  return this.access >= ACCESS.ADMIN;
});

schema.virtual(`emailHash`).get(function () {
  return (
    (this.email &&
      crypto
        .createHash(`md5`)
        .update(this.email.toLowerCase())
        .digest(`hex`)) ||
    ``
  );
});

schema.set(`toObject`, {
  transform(doc, ret, options) {
    delete ret.verifyHash;
    return ret;
  },
});

module.exports = mongoose.model(`User`, schema);

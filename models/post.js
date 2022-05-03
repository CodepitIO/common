require(`./user`);
const mongoose = require(`mongoose`);
const Joi = require(`joi`);
const CollectionCounter = require(`./collection_counter`);
const aws = require(`aws-sdk`);
const { CONN } = require(`../constants`);
const C = require(`../constants`);

const S3 = new aws.S3({ params: { Bucket: CONN.GET_S3_BUCKET() } });

const { ObjectId } = mongoose.Schema.Types;

const schema = mongoose.Schema(
  {
    _id: { type: Number, min: 1 },
    author: {
      type: ObjectId,
      ref: `User`,
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

schema.statics.validate = (obj) =>
  Joi.object({
    title: Joi.string().min(1).max(100).required(),
    body: Joi.string().min(1).max(2000).required(),
    author: Joi.string().min(1).max(100).required(),
    blog: Joi.string().min(1).max(100).optional(),
  }).validate(obj);

schema.pre(`save`, async function preSave() {
  await CollectionCounter.setIncrementalId(this, `Post`);
  const path = `assets/blog/${this._id}.html`;
  S3.upload(
    {
      Key: path,
      Body: this.body,
      ACL: `public-read`,
      CacheControl: `max-age=1209600`,
    },
    (err, details) => {
      console.log(details);
    }
  );
  this.body = `${C.STATIC_ASSETS_DOMAIN}/blog/${this._id}.html`;
});

module.exports = mongoose.model(`Post`, schema);

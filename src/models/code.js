const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CodeSchema = new Schema({
  cip: { type: String },
  challenge: { type: String },
  language: { type: String },
  code: { type: String }
}, {
  toObject: { virtuals: true }
});

CodeSchema.index({ cip: 1, challenge: 1, language: 1 }, { unique: true });

CodeSchema.virtual('created').get(function () {
  return this._id.getTimestamp();
});

CodeSchema.statics.save = function (code) {
  return this.update({ cip: code.cip, challenge: code.challenge, language: code.language }, code, { upsert: true });
};

CodeSchema.statics.getChallenge = function (cip, challenge) {
  return this.find({ cip, challenge });
};

module.exports = mongoose.model('Code', CodeSchema);

const mongoose = require('mongoose');

const Schema = require('./schema');

const CodeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  language: {
    type: Schema.Types.ObjectId,
    ref: 'Language'
  },
  code: {
    type: String,
    required: true
  }
});

CodeSchema.index({ user: 1, challenge: 1, language: 1 }, { unique: true });

CodeSchema.statics.save = function (code) {
  return this.update({ user: code.user, challenge: code.challenge, language: code.language }, code, { upsert: true });
};

CodeSchema.statics.getChallenge = function (user, challenge) {
  return this.find({ user, challenge });
};

module.exports = mongoose.model('Code', CodeSchema);

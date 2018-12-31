/**
 * Dependencies
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/**
 * Constants
 */
var CodeSchema = new Schema({
  cip: {type: String},
  challenge: {type: String},
  language: {type: String},
  code: {type: String}
}, {
  toObject: { virtuals: true }
});

CodeSchema.index({ cip: 1, challenge: 1, language: 1}, {unique: true} );

/**
 * Virtuals
 */
CodeSchema.virtual('created').get(function () {
  return this._id.getTimestamp();
});

/**
 * Statics
 */

CodeSchema.statics.save = function (code) {
  return this.update({cip: code.cip, challenge: code.challenge, language: code.language}, code, {upsert: true});
};

CodeSchema.statics.getChallenge = function (cip, challenge) {
  return this.find({cip: cip, challenge: challenge});
}

// Model creation
mongoose.model("Code", CodeSchema);

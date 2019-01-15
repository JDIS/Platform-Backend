const mongoose = require('mongoose');

const Schema = require('./schema');

const ChallengeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  isCodingChallenge: {
    type: Boolean,
    required: true
  },
  timeAllowed: {
    type: Number,
    required: true
  },
  numberTests: Number,
  languagesAllowed: {
    blacklist: [{
      type: Schema.Types.ObjectId,
      ref: 'Language'
    }],
    whitelist: [{
      type: Schema.Types.ObjectId,
      ref: 'Language'
    }]
  },
  boilerplates: [{
    _id: false,
    language: {
      type: Schema.Types.ObjectId,
      ref: 'Language'
    },
    code: {
      type: String,
      required: true
    }
  }]
});

module.exports = mongoose.model('Challenge', ChallengeSchema);

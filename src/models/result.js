const mongoose = require('mongoose');

const Schema = require('./schema');

const ResultSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  points: {
    type: Number,
    required: true
  },
  percent: {
    type: Number,
    required: true
  },
  tests: [{
    _id: false,
    test: {
      type: Schema.Types.ObjectId,
      ref: 'Test'
    },
    output: String,
    error: String,
    percent: { type: Number },
    isSuccess: { type: Boolean },
    isTimeout: { type: Boolean },
    isCompilationError: { type: Boolean }
  }]
});

ResultSchema.index({ user: 1, challenge: 1 }, { unique: true });

ResultSchema.statics.getUsersPoints = function () {
  return this.aggregate([{
    $group: {
      _id: '$user',
      points: { $sum: '$points' } }
  }, {
    $sort: { points: -1 }
  }]);
};

ResultSchema.statics.getUserPoints = async function (user) {
  const result = await this.aggregate([{
    $match: {
      user: new mongoose.Types.ObjectId(user)
    }
  }, {
    $group: {
      _id: '$user',
      points: { $sum: '$points' }
    }
  }]);

  return (result.length && result[0].points) || 0;
};

ResultSchema.statics.save = function (result) {
  return this.update({ user: result.user, challenge: result.challenge }, result, { upsert: true });
};

module.exports = mongoose.model('Result', ResultSchema);

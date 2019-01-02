const mongoose = require('mongoose');

const Schema = require('./schema');

const TestSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  isCode: {
    type: Boolean,
    required: true
  },
  inputs: [{
    type: String
  }],
  outputs: [{
    type: String
  }],
  code: String
});

module.exports = mongoose.model('Test', TestSchema);

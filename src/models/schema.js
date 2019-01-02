const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// enhance default options for all mongoose schemas:
// - removes fields we don't want to return in the API
// - add createdAt and updatedAt
const defaultOptions = Schema.prototype.defaultOptions;

Schema.prototype.defaultOptions = function (options) {
  const allOptions = defaultOptions.call(this, options);
  allOptions.timestamps = true;
  allOptions.toJSON = {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  };
  return allOptions;
};

module.exports = Schema;

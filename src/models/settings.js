const mongoose = require('mongoose');

const C = require('../constants');

const Schema = require('./schema');

const SettingsSchema = new Schema({
  submitActivated: {
    type: Boolean,
    required: true
  },
  showChallenges: {
    type: Boolean,
    required: true
  }
});

SettingsSchema.statics.get = async function () {
  let settings = await this.findOne({}).cache(0, C.REDIS.SETTINGS);

  if (!settings) {
    settings = await this.create({
      submitActivated: true,
      showChallenges: true
    });
  }

  return settings;
};

// Patch until cachegoose fixes their shit (they create new ID for some reason)
// See https://github.com/boblauer/cachegoose/issues/49
SettingsSchema.statics.save = async function (settings) {
  const realSettings = await this.findOne({});
  realSettings.submitActivated = settings.submitActivated;
  realSettings.showChallenges = settings.showChallenges;
  realSettings.save();
};

module.exports = mongoose.model('Settings', SettingsSchema);

const cachegoose = require('cachegoose');

const C = require('../constants');
const Settings = require('../models/settings');

const activateSubmit = async (ctx) => {
  const settings = await Settings.get();
  settings.submitActivated = true;

  await Settings.save(settings);
  cachegoose.clearCache(C.REDIS.SETTINGS);

  ctx.status = 200;
};

const deactivateSubmit = async (ctx) => {
  const settings = await Settings.get();
  settings.submitActivated = false;

  await Settings.save(settings);
  cachegoose.clearCache(C.REDIS.SETTINGS);

  ctx.status = 200;
};

const showChallenges = async (ctx) => {
  const settings = await Settings.get();
  settings.showChallenges = true;

  await Settings.save(settings);
  cachegoose.clearCache(C.REDIS.SETTINGS);

  ctx.status = 200;
};

const hideChallenges = async (ctx) => {
  const settings = await Settings.get();
  settings.showChallenges = false;

  await Settings.save(settings);
  cachegoose.clearCache(C.REDIS.SETTINGS);

  ctx.status = 200;
};

module.exports = {
  activateSubmit,
  deactivateSubmit,
  showChallenges,
  hideChallenges
};

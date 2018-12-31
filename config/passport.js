const User = require('mongoose').model('User');

const authenticator = require('../lib/authenticator');
const CASStrategy = require('../lib/cas-strategy');

const serialize = (user, done) => {
  done(null, user._id);
};

const deserialize = async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
};

module.exports = function (passport) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new CASStrategy({
    baseUrl: 'https://cas.usherbrooke.ca',
    callbackUrl: '/api/auth/cas/callback',
    extract: authenticator.extractCASProfile
  },
  authenticator.CASUser
  ));
};

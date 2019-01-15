const mongoose = require('mongoose');

const Schema = require('./schema');

const UserSchema = new Schema({
  cip: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[a-z]{4}\d{4}$/
  },
  preferredLanguage: String,
  email: {
    type: String,
    lowercase: true
  },
  name: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
});

UserSchema.statics.findByCip = function (cip) {
  return this.findOne({ cip: cip.toLowerCase() });
};

UserSchema.statics.findOrCreateUser = async function (profile, casRes) {
  let user = await this.findOne({ cip: profile.id });

  if (!user) {
    user = new this({
      cip: profile.id
    });

    // first user should be admin
    if (await this.count() === 0) {
      user.isAdmin = true;
    }

    // fill optional fields
    if (profile.emails) {
      user.email = profile.emails[0].value;
    }
    if (profile.displayName) {
      user.name = profile.displayName;
    }

    await user.save();
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);

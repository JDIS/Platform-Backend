const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  data: {
    cip: { type: String, required: true, unique: true, lowercase: true, match: /^[a-z]{4}\d{4}$/ },
    language: { type: String },
    email: { type: String, lowercase: true },
    name: { type: String }
  },
  meta: {
    provider: { type: String },
    isAdmin: { type: Boolean, default: false }
  }
}, {
  toObject: { virtuals: true },
  toJSON: {
    transform(doc, ret, options) {
      // Only act on the parent document
      if (typeof doc.ownerDocument !== 'function') {
        const retVal = ret.data;
        retVal.id = doc.id;
        retVal.created = doc.meta.created;
        retVal.isAdmin = doc.meta ? doc.meta.isAdmin : undefined;
        return retVal;
      }
      ret.id = doc._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

UserSchema.virtual('meta.created').get(function () {
  return this._id.getTimestamp();
});

UserSchema.statics.findByCip = function (cip) {
  return this.findOne({ 'data.cip': cip.toLowerCase() });
};

UserSchema.statics.findOrCreateUser = async function (profile, casRes) {
  let user = await this.findOne({ 'data.cip': profile.id });

  if (!user) {
    user = new this({
      data: {
        cip: profile.id
      },
      meta: {
        provider: profile.provider
      }
    });

    // first user should be admin
    if (await this.count() === 0) {
      user.meta.isAdmin = true;
    }

    // fill optional fields
    if (profile.emails) {
      user.data.email = profile.emails[0].value;
    }
    if (profile.displayName) {
      user.data.name = profile.displayName;
    }

    await user.save();
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);

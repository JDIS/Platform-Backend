const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  data: {
    cip: { type: String, required: true, unique: true, lowercase: true, match: /^[a-z]{4}\d{4}$/ },
    language: { type: String },
    email: { type: String, lowercase: true },
    name: { type: String },
    concentration: { type: Number },
    promocard: {
      price: { type: Number },
      date: { type: Date },
    },
    totalPoints: { type: Number },
    points: [{
      reason: { type: String, required: true },
      points: { type: Number },
    }],
  },
  meta: {
    provider: {type : String },
    isAdmin: { type: Boolean, default: false }
  }
}, {
  toObject: { virtuals: true },
  toJSON : {
    transform: function (doc, ret, options) {
      // Only act on the parent document
      if ("function" !== typeof doc.ownerDocument) {
        let retVal = ret.data;
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

UserSchema.methods.awardPoints = function (giver, points, rawReason) {
  // Get current date
  var date = (new Date().toISOString().split("T"))[0];
  // @TODO export that to a module, so we can test the format
  var reason = date + ": " + giver + " -- " + rawReason;

  this.data.points = this.data.points || [];
  this.data.points.push({
    points: points,
    reason: reason,
  });
};

UserSchema.statics.findByCip = function (cip) {
  return this.findOne({ "data.cip": cip.toLowerCase() });
};

UserSchema.statics.findOrCreateUser = async function (profile, casRes) {
  var user = await this.findOne({ "data.cip": profile.id }).exec();

  if (!user) {
    user = new this({ data: { cip: profile.id } });
  }

  fillInfosFromCAS(profile, user);

  user.meta.provider = profile.provider;
  await user.save();

  return user;
};

function fillInfosFromCAS (profile, user) {
  if (!profile.emails) {
    // We dont have informations
    return;
  }
  user.data.email = profile.emails[0].value;
  user.data.name = profile.displayName;
};

module.exports = mongoose.model("User", UserSchema);

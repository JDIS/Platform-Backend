const User = require('mongoose').model('User');

const ATTRIBUTES = {
  FR: {
    MAIL: 'cas:courriel',
    CN: 'cas:nomAffichage',
    GIVEN_NAME: 'cas:prenom',
    SN: 'cas:nomFamille'
  },
  EN: {
    MAIL: 'cas:mail',
    CN: 'cas:cn',
    GIVEN_NAME: 'cas:givenName',
    SN: 'cas:sn'
  }
};

exports.CASUser = function (profile, res, done) {
  User
    .findOrCreateUser(profile, res)
    .then((user) => {
      done(null, user);
    });
};

exports.extractCASProfile = function (parsedRes) {
  if (!parsedRes['cas:serviceResponse'] || !parsedRes['cas:serviceResponse']['cas:authenticationSuccess']) {
    throw new Error('CAS Strategy: Authentication failure', parsedRes);
  }
  const successBody = parsedRes['cas:serviceResponse']['cas:authenticationSuccess'][0];
  const profile = { provider: 'cas-udes', id: successBody['cas:user'][0] };
  // Fetch rest of profile when available
  let ATTR = ATTRIBUTES.EN;
  if (successBody['cas:attributes']) {
    const attributes = successBody['cas:attributes'][0];
    if (!attributes[ATTR.MAIL]) {
      ATTR = ATTRIBUTES.FR;
    }
    // In case the attributes are really not there...
    if (!attributes[ATTR.MAIL]) {
      return profile;
    }
    profile.emails = [{
      value: attributes[ATTR.MAIL][0],
      type: 'school'
    }];
    profile.displayName = attributes[ATTR.CN][0];
    profile.name = {
      givenName: attributes[ATTR.GIVEN_NAME][0],
      familyName: attributes[ATTR.GIVEN_NAME][0]
    };
  }
  return profile;
};

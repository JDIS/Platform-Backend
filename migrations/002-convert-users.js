module.exports = {
  async up(db) {
    const users = await db.collection('users').find({}).toArray();

    for (const user of users) {
      const newUser = {
        cip: user.data.cip,
        isAdmin: user.meta.isAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: user.__v
      };

      if (user.data.language) {
        newUser.preferredLanguage = user.data.language;
      }
      if (user.data.email) {
        newUser.email = user.data.email;
      }
      if (user.data.name) {
        newUser.name = user.data.name;
      }

      await db.collection('users').replaceOne({ _id: user._id }, newUser);
    }
  }
};

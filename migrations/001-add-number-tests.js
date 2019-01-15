module.exports = {
  async up(db) {
    const challenges = await db.collection('challenges').find({}, { _id: true }).toArray();

    for (const challenge of challenges) {
      const count = await db.collection('tests').countDocuments({ challenge: challenge._id });
      await db.collection('challenges').updateOne({ _id: challenge._id }, { $set: { numberTests: count } });
    }
  }
};

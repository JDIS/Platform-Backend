module.exports = {
  async up(db) {
    try {
      await db.collection('codes').dropIndex('cip_1_challenge_1_language_1');
    } catch (_) {
      // Do nothing
    }
  }
};

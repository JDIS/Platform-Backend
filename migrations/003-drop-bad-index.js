module.exports = {
  async up(db) {
    try {
      await db.collection('users').dropIndex('data.cip_1');
    } catch (_) {
      // Do nothing
    }
  }
};

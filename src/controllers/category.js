const Category = require('../models/category');
const { readFileAsync } = require('../utils');

const seed = async (ctx) => {
  const added = [];
  const categories = JSON.parse(await readFileAsync(`${global.__basedir}/seed/categories.json`, { encoding: 'utf8' }));
  for (const category of categories) {
    if (await Category.findOne({ name: category.name })) {
      continue;
    }
    added.push(await Category.create(category));
  }
  ctx.status = 200;
  ctx.body = added;
};

const getAll = async (ctx) => {
  ctx.status = 200;
  ctx.body = await Category.find({});
};

module.exports = {
  seed,
  getAll
};

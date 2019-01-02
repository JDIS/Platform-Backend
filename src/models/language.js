const mongoose = require('mongoose');

const Schema = require('./schema');

const LanguageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bin: String,
  fileExtension: {
    type: String,
    required: true
  },
  dockerImage: {
    type: String,
    required: true
  },
  dockerCompiler: String,
  compiledPostfix: String,
  runPreArgs: {
    type: Array,
    default: []
  },
  interpreter: {
    type: Boolean,
    required: true
  },
  highlight: {
    type: String,
    required: true
  }
});

LanguageSchema.statics.getByNames = async function (names) {
  const languages = [];
  for (const name of names) {
    const language = await this.findOne({ name });
    if (language) {
      languages.push(language);
    }
  }
  return languages;
};

module.exports = mongoose.model('Language', LanguageSchema);

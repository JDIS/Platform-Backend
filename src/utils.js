const crypto = require('crypto');
const execFile = require('child_process').execFile;
const fs = require('fs');
const promisify = require('util').promisify;
const os = require('os');

const genId = () => crypto.randomBytes(16).toString('hex');

// util.promisify on execFile, prevents feeding data
// to stdin, so we write our own
const promisifyWithData = (orig) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      const options = args[args.length - 1];
      const proc = orig(...args, (err, stdout, stderr) => {
        if (err !== null) {
          err.stdout = '';
          err.stderr = '';
          if (stdout) { err.stdout = stdout; }
          if (stderr) { err.stderr = stderr; }
          reject(err);
        } else {
          resolve({ stdout, stderr });
        }
      });
      if (options.input) {
        proc.stdin.write(options.input);
        proc.stdin.write(os.EOL);
      }
    });
  };
};

const head = (str, length = 1 << 12) => {
  if (str.length > length) {
    return str.substring(0, length) + '\n (abridged)';
  }
  return str;
};

module.exports = {
  genId,
  head,
  execFileAsync: promisifyWithData(execFile),
  readFileAsync: promisify(fs.readFile),
  readdirAsync: promisify(fs.readdir)
};

const os = require('os');

const logger = require('winston');

const { genId, execFileAsync, head } = require('../../utils');

class Tester {
  constructor(filename, language, challenge) {
    // Common
    this.dockerImage = language.dockerImage;
    this.interpreter = language.interpreter;
    this.filename = filename;
    this.timeAllowed = challenge.timeAllowed;
    this.runPreArgs = language.runPreArgs.slice();

    // specific
    this.bin = language.bin || '';
    this.dockerCompiler = language.dockerCompiler || '';
    this.compiledPostfix = language.compiledPostfix || '';

    this.tests = [];
  }

  setTests(tests) {
    this.tests = tests;
  }

  verifyOutput(output, expected) {
    if (output.length !== expected.length) {
      return false;
    }
    for (const i in output) {
      if (output[i] !== expected[i]) {
        return false;
      }
    }

    return true;
  }

  run() {
    let promise = new Promise((a, b) => a());
    if (!this.interpreter) {
      promise = this
        .prepareComp()
        .then((x) => this.compile(x));
    }

    return promise.then((x) => this.prepareTests(x))
      .then((x) => this.doTests(x))
      .catch((err) => {
        if (err.results) {
          return err;
        }
        // TODO: add logging console.log(err);
        return { results: [], percent: 0 };
      })
      .then((x) => this.clean(x)); // acts as finally
  }

  prepareComp() {
    this.compImageName = genId();
    const args = [
      'run', '--rm', '-tid',
      '-v', `${global.__basedir}/data/codes/tmp:/tmp/output`,
      '-v', `${global.__basedir}/data/codes/${this.filename}:/tmp/${this.filename}`,
      '--name', this.compImageName,
      this.dockerCompiler
    ];
    return execFileAsync('docker', args, { timeout: 5000 });
  }

  prepareTests() {
    this.testImageName = genId();
    const args = [
      'run', '--rm', '-tid',
      '-v', `${global.__basedir}/data/codes/${this.filename}:/tmp/${this.filename}`,
      '-v', `${__dirname}/readline.js:/tmp/readline.js`,
      '--name', this.testImageName,
      this.dockerImage
    ];
    return execFileAsync('docker', args, { timeout: 5000 });
  }

  compile() {
    const args = [
      'exec', '-i',
      this.compImageName, '/tmp/compile.sh', `${this.filename}`
    ];
    const err = () => {
      const results = this.tests.map((test) => {
        return { test: test._id, isSuccess: false, isTimeout: false, isCompilationError: true };
      });
      throw { tests: results, percent: 0 };
    };
    const log = (res) => {
      logger.debug(this.filename);
      logger.debug('-----------COMPILATION-------------');
      logger.debug(`stdout: ${res.stdout}`);
      logger.debug(`stderr: ${res.stderr}`);
      logger.debug('-----------------------------------');
    };
    return execFileAsync('docker', args, { timeout: 5000 }).then((res) => {
      log(res);
      this.filename = `tmp/${this.filename.split('.')[0]}`;

      if (res.stderr.byteLength > 0) {
        err();
      }
    }).catch((e) => {
      log(e);
      err();
    });
  }

  doTests() {
    const promises = this.tests.map((test) => {
      const options = {
        timeout: this.timeAllowed * 1000,
        input: test.inputs.join(os.EOL),
        encoding: 'utf-8'
      };
      const args = [
        'exec', '-i',
        this.testImageName
      ];
      if (this.bin !== '') {
        args.push(this.bin);
        args.push(...this.runPreArgs);
      }
      args.push(`/tmp/${this.filename}${this.compiledPostfix}`);
      return execFileAsync('docker', args, options).then((res) => [res, test]).catch((err) => [err, test]);
    });

    return Promise.all(promises).then((resList) => {
      let successCount = 0;
      const results = resList.map(([res, test]) => {
        logger.debug(this.filename);
        logger.debug('-----------------------------------');
        logger.debug(`stdout: ${head(res.stdout.trim())}`);
        logger.debug(`stderr: ${head(res.stderr.trim())}`);
        logger.debug('-----------------------------------');
        const isSuccess = this.verifyOutput(res.stdout.replace(/\r/g, '').replace(/\n$/, '').split('\n'), test.outputs);
        const isTimeout = !!res.killed;
        if (isSuccess) { successCount++; }
        return { test: test._id, isSuccess, isTimeout, isCompilationError: false };
      });
      return { tests: results, percent: successCount / this.tests.length };
    });
  }

  clean(res) {
    // async shutdown, but forwards results right away
    const args = ['stop', '-t', '1'];
    if (this.testImageName) { args.push(this.testImageName); }
    if (this.compImageName) { args.push(this.compImageName); }
    if (args.length !== args.lenInit) {
      execFileAsync('docker', args, { timeout: 5000 }).catch((e) => {
        logger.debug('[!] Unable to terminate container', e);
      });
    }

    return res;
  }
}

module.exports = Tester;

const os = require('os');
const { genId, execFileAsync, head } = require('../../utils');

class Tester {
	constructor(filename, language) {
		this.bin = language.bin;
		this.dockerImage = language.dockerImage;
		this.dockerCompiler = language.dockerCompiler;
		this.compiledPostfix = language.compiledPostfix;
		this.runPreArgs = language.runPreArgs.slice();
		this.interpreter = language.interpreter;
		this.filename = filename;
		this.test = [];
	}

	setTest(test) {
		this.test = test;
	}

	verifyOutput(output, expected) {
		if (output.length != expected.length) {
			return false;
		}
		for (let i in output) {
			if (output[i] !== expected[i]) {
				return false;
			}
		}

		return true;
	}

	run() {
		let promise = new Promise((a,b) => a());
		if(!this.interpreter)
			promise = this.prepareComp()
				.then(x => this.compile(x));

		return promise.then(x => this.prepareTests(x))
			.then(x => this.doTests(x))
			.catch(err => {
				if (err.results)
					return err;
				else {
					console.log(err);
					return {results: [], percent: 0};
				}
			})
			.then(x => this.clean(x)); // acts as finally
	}

	prepareComp() {
		this.compImageName = genId();
		const args = [
		  "run", "--rm", "-tid",
		  "-v", `${process.env.HOST_PWD}/src/challenges/codes/tmp:/tmp/output`,
		  "-v", `${process.env.HOST_PWD}/src/challenges/codes/${this.filename}:/tmp/${this.filename}`,
		  "--name", this.compImageName,
		  this.dockerCompiler
		];
		return execFileAsync("docker", args, {timeout: 5000});
	}

	prepareTests() {
		this.testImageName = genId();
		const args = [
		  "run", "--rm", "-tid",
		  "-v", `${process.env.HOST_PWD}/src/challenges/codes/${this.filename}:/tmp/${this.filename}`,
		  "-v", `${process.env.HOST_PWD}/src/challenges/codes/readline.js:/tmp/readline.js`,
		  "--name", this.testImageName,
		  this.dockerImage
		];
		return execFileAsync("docker", args, {timeout: 5000});
	}

	compile() {
		let args = [
		  "exec", "-i",
		  this.compImageName, "/tmp/compile.sh", `${this.filename}`
		];
		const err = () => {
			const results = this.test.tests.map(test => {
				return {name: test.name, isSuccess: false, isTimeout: false, isCompilationError: true};
			});
			throw {results: results, percent: 0};
		};
		const log = (res) => {
			console.log(this.filename);
			console.log('-----------COMPILATION-------------');
			console.log(`stdout: ${res.stdout}`);
			console.log(`stderr: ${res.stderr}`);
			console.log('-----------------------------------');
		};
		return execFileAsync("docker", args, {timeout: 5000}).then(res => {
			log(res);
			this.filename = `tmp/${this.filename.split('.')[0]}`

			if (res.stderr.byteLength > 0)
				err();
		}).catch((e) => {
			log(e)
			err();
		});
	}

	doTests() {
		const promises = this.test.tests.map(test => {
			let options = {
				timeout: this.test.timeAllowed*1000,
				input: test.inputs.join(os.EOL),
				encoding: 'utf-8'
			}
			let args = [
			  "exec", "-i",
			  this.testImageName
			];
			if (this.bin != "") {
				args.push(this.bin);
				args.push(...this.runPreArgs);
			}
			args.push(`/tmp/${this.filename}${this.compiledPostfix}`);
			return execFileAsync("docker", args, options).then((res) => [res, test]).catch((err) => [err, test]);
		});

		return Promise.all(promises).then(resList => {
			let successCount = 0;
			const results = resList.map(([res, test]) => {
				console.log(this.filename);
				console.log('-----------------------------------');
				console.log(`stdout: ${head(res.stdout.trim())}`);
				console.log(`stderr: ${head(res.stderr.trim())}`);
				console.log('-----------------------------------');
				let isSuccess = this.verifyOutput(res.stdout.replace(/\r/g,'').replace(/\n$/,"").split('\n'), test.outputs)
				let isTimeout = res.killed;
				if (isSuccess) successCount++;
				return {name: test.name, isSuccess: isSuccess, isTimeout: isTimeout, isCompilationError: false};
			});
			return {results: results, percent: successCount/this.test.tests.length};
		});
	}

	clean(res) {
		// async shutdown, but forwards results right away
		const args = [ "stop", "-t", "1" ];
		const lenInit = args.length;
		if(this.testImageName)
			args.push(this.testImageName);
		if(this.compImageName)
			args.push(this.compImageName);
		if(args.length != args.lenInit)
			execFileAsync("docker", args, {timeout: 5000}).catch((e) => {
				console.log("[!] Unable to terminate container");
				console.log(e);
		});

	return res;
	}
}

module.exports = Tester;

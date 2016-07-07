'use strict'

let emitter = require("global-queue");
let patchwerk = require('patchwerk')(emitter);


class Office {
	constructor() {
		this.emitter = emitter;
	}
	init(config) {}
	launch() {
		return Promise.resolve(true);
	}
}

module.exports = Office;

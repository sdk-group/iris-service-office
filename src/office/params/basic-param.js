'use strict'

class BasicParam {
	constructor(org_addr) {
		this.org_addr = org_addr;
	}
	get value() {
		return new Error('BasicParam value');
	}
	update() {

	}
	isFresh() {
		return false;
	}
}

module.exports = BasicParam;

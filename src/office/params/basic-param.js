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
	canUpdate(response) {
		return _.reduce(this.queryTemplate(), (acc, value, name) => acc && _.has(response, name), true)
	}
	isFresh() {
		return false;
	}
}

module.exports = BasicParam;

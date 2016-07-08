'use strict'

let BasicParam = require('./basic-param.js');

let template = {
	'max': {
		aggregator: "maxTimeInSeconds",
		key: "waitingTime",
		filter: ['waitingTime > 0', 'state = registered'],
		transform: ['waiting-time']
	}
};

class MaxWaitingTime extends BasicParam {
	queryTemplate() {
		return template;
	}
	update(response) {
		this.data = {
			value: response.nogroup['max']
		}
	}
	get value() {
		return this.data.value;
	}
}


module.exports = MaxWaitingTime;

'use strict'

let BasicParam = require('./basic-param.js');

let template = {
	'max': {
		aggregator: "maxTimeInSeconds",
		key: "waitingTime",
		filter: ['waitingTime > 0', 'state = registered', '!hasEventPostpone'],
		transform: ['waiting-time']
	}
};

class MaxWaitingTime extends BasicParam {
	queryTemplate() {
		return template;
	}
	update(response) {
		this.data = this.canUpdate(response) ? {
			value: response['max']
		} : {};
	}
	get value() {
		return this.data.value || 0;
	}
}


module.exports = MaxWaitingTime;

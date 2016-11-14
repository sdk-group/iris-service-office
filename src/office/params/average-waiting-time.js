'use strict'

let BasicParam = require('./basic-param.js');

let template = {
	'time': {
		aggregator: "sum",
		key: "waitingTime",
		filter: ['waitingTime > 0'],
		transform: ['waiting-time']
	},
	'count': {
		aggregator: "count",
		filter: ['waitingTime > 0'],
		transform: ['waiting-time']
	}
};

class AverageWaitingTime extends BasicParam {
	queryTemplate() {
		return template;
	}
	update(response) {
		this.data = this.canUpdate(response) ? {
			total: response['time'] / 1000,
			count: response['count'],
			value: response['time'] / 1000 / response['count']
		} : {}
	}
	get value() {
		return this.data.value;
	}
	get paramName() {
		return 'AverageWaitingTime';
	}
}


module.exports = AverageWaitingTime;
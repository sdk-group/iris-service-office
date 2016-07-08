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
		this.data = {
			total: response.nogroup['time'] / 1000,
			count: response.nogroup['count'],
			value: response.nogroup['time'] / 1000 / response.nogroup['count']
		}
	}
	get value() {
		return this.data.value;
	}
}


module.exports = AverageWaitingTime;

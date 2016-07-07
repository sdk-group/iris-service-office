module.exports = {
	entity: 'Ticket',
	params: {
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
	}
};

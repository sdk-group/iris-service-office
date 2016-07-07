'use strict'

let events = {
	office: {}
}

let tasks = [];


module.exports = {
	module: require('./office.js'),
	permissions: [],
	tasks: tasks,
	exposed: true,
	events: {
		group: 'office',
		shorthands: events.office
	}
};

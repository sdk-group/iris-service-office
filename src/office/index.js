'use strict'

let events = {
	office: {}
}

let tasks = [];


module.exports = {
	module: require('./office.js'),
	name: 'office',
	permissions: [],
	tasks: tasks,
	exposed: true,
	events: {
		group: 'office',
		shorthands: events.office
	}
};
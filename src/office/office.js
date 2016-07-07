'use strict'

let _ = require('lodash');

let emitter = require("global-queue");
let patchwerk = require('patchwerk')(emitter);

let template = require('./tickets-template.js');
const notification_interval = 15000;

class Office {
	constructor() {
		this.emitter = emitter;
		this.offices = {};
	}
	init(config) {
		this.emitter.on('ticket.emit.state', ({
			ticket,
			org_addr,
			workstation,
			event_name
		}) => {
			let to_join = ['ticket', event_name, org_addr, workstation];
			if (event_name == 'call') this.processCall(ticket, org_addr)
		});

		setInterval(() => this.notifyStatusChange(), notification_interval);

		return true;
	}
	processCall(ticket, org_addr) {
		console.log('processCall');

		this.getInitialValues(org_addr).then((rebuild) => {
			if (rebuild) return true;

			let history = ticket.history;
			let calls = _.filter(history, ['event_name', 'call']);

			if (calls.length > 1) return false;

			let first_called = _.head(calls);
			let registered = _.find(history, ['event_name', 'register']) || _.find(history, ['event_name', 'activate']);

			this.offices[org_addr].count++;
			this.offices[org_addr].total += ((first_called.time - registered.time) / 1000);
			this.offices[org_addr].updated = true;
		});
	}
	notifyStatusChange() {
		_.forEach(this.offices, (organization, org_addr) => {
			this.emitter.emit('broadcast', {
				event: _.join(['office.average-waiting-time', org_addr], "."),
				data: {
					value: (organization.total / organization.count)
				}
			});

			organization.updated = false;
		});
	}
	getInitialValues(org_addr) {
		let now = moment().format('YYYY-MM-DD');

		if (_.has(this.offices, org_addr) && _.get(this.offices, [org_addr, 'date']) == now) return Promise.resolve(false);

		template.interval = [now, now];
		template.department = org_addr.split('.')[1];

		return this.emitter.addTask('reports', {
			_action: 'get-table',
			table: template
		}).then(r => {
			this.offices[org_addr] = {
				date: now,
				updated: true,
				total: r.nogroup['time'] / 1000,
				count: r.nogroup['count']
			};

			return true;
		});
	}
	launch() {

		// return patchwerk.get('organization-structure', {}).then(d => {
		// 	console.log(_.map(_.filter(d.content, (o) => !o.unit_of), '@id'));
		// 	return true;
		// })
		return Promise.resolve(true);
	}
}

module.exports = Office;
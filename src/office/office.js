'use strict'

let _ = require('lodash');

let emitter = require("global-queue");
let patchwerk = require('patchwerk')(emitter);

let template = require('./tickets-template.js');

class Office {
	constructor() {
		this.emitter = emitter;
		this.offices = {};
	}
	init(config) {
		console.log('subscribe');

		this.emitter.on('ticket.emit.state', ({
			ticket,
			org_addr,
			workstation,
			event_name
		}) => {
			let to_join = ['ticket', event_name, org_addr, workstation];
			if (event_name == 'call') this.processCall(ticket, org_addr)
		});
		return true;
	}
	processCall(ticket, org_addr) {
		console.log('processCall');
		let history = ticket.history;
		let calls = _.filter(history, ['event_name', 'call']);

		if (calls.length > 1) return false;

		let first_called = _.head(calls);
		let registered = _.find(history, ['event_name', 'register']) || _.find(history, ['event_name', 'activate']);

		this.getInitialValues(org_addr).then((rebuild) => {
			if (rebuild) return;
			this.offices[org_addr].count++;
			this.offices[org_addr].total += ((first_called.time - registered.time) / 1000);

		}).then(() => {
			this.emitter.emit('broadcast', {
				event: _.join(['office.average-waiting-time', org_addr], "."),
				data: {
					value: (this.offices[org_addr].total / this.offices[org_addr].count)
				}
			});
		})

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

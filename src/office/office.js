'use strict'

let _ = require('lodash');

let emitter = require("global-queue");
let patchwerk = require('patchwerk')(emitter);

let AverageWaitingTime = require('./params/average-waiting-time.js');
let MaxWaitingTime = require('./params/max-waiting-time.js');

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
			// if (!this.offices[org_addr]) this.offices[org_addr] = [new AverageWaitingTime(org_addr), new MaxWaitingTime(org_addr)];
			if (!this.offices[org_addr]) this.offices[org_addr] = [new MaxWaitingTime(org_addr)];
		});

		setInterval(() => this.notifyStatusChange(), notification_interval);

		return true;
	}
	notifyStatusChange() {
		_.forEach(this.offices, (params, org_addr) => {
			let to_update = _.filter(params, param => !param.isFresh());

			let query_params = _.transform(to_update, (t, param) => {
				_.defaults(t, param.queryTemplate())
			}, {});

			let template = this.makeTemplate(query_params, org_addr);

			//@NOTE: use async/await here in future ... or not
			this.updateParams(template, to_update).then(() => this.sendNotifications(params));
		});
	}
	makeTemplate(query_params, org_addr) {
		let now = moment().format('YYYY-MM-DD');
		let template = {
			entity: 'Ticket',
			interval: [now, now],
			department: org_addr.split('.')[1],
			params: query_params
		};
		return template;
	}
	updateParams(template, to_update) {
		return this.emitter.addTask('reports', {
			_action: 'get-table',
			table: template
		}).then(report => _.forEach(to_update, param => param.update(report.nogroup)))
	}
	sendNotifications(params) {
		_.forEach(params, param => {
			let broadcast_data = {
				event: _.join(['office', _.kebabCase(param.constructor.name), param.org_addr], "."),
				data: {
					value: param.value
				}
			};

			this.emitter.emit('broadcast', broadcast_data);
		});
	}
	launch() {
		return Promise.resolve(true);
	}
}

module.exports = Office;

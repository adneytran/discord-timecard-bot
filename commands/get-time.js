const pluralize = require('pluralize');
const userList = require('../userTimeCard.json');
module.exports = {
	name: 'gettime',
	description: 'gets a user\'s total time clocked in',
	execute(message) {
		let userId = message.author.id;
		let messagePrefix = 'You have';

		if (message.mentions.members.first() != undefined) {
			if (message.mentions.members.first().user.bot) {
				message.channel.send('beep boop I am always clocked in');
				return;
			}
			userId = message.mentions.members.first().id;
			messagePrefix = 'This user has';
		}
		else if (!Object.prototype.hasOwnProperty.call(userList, userId)) {
			message.channel.send('this user isn\'t part of some dumb deal lmao');
			return;
		}

		const userTimeInSeconds = userList[userId].totalTimeInSeconds;
		const hours = Math.floor(userTimeInSeconds / 3600);
		const minutes = Math.floor((userTimeInSeconds % 3600) / 60);
		message.channel.send(messagePrefix + ' slaved for ' + hours + pluralize(' hour', hours) + ' and ' + minutes + pluralize(' minute', minutes));
	},
};
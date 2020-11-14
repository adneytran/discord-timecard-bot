const pluralize = require('pluralize');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	Bucket: 'discordtimecardbot',
});

const params = {
	Bucket: 'discordtimecardbot',
	Key: 'userTimeCard.json',
};

module.exports = {
	name: 'gettime',
	description: 'gets a user\'s total time clocked in',
	execute(message) {
		s3.getObject(params, function(error, data) {
			if (error != null) {
				console.log('Failed to retrieve an object: ' + error);
			}
			else {
				const userData = JSON.parse(data.Body.toString('utf-8'));
				let userId = message.author.id;
				let messagePrefix = 'You have';

				if (message.mentions.members.first() != undefined) {
					if (message.mentions.members.first().user.bot) {
						message.channel.send('beep boop I am always clocked in');
						return;
					}
					else if ((!Object.prototype.hasOwnProperty.call(userData, userId))) {
						message.channel.send('this user isn\'t part of some dumb deal lmao');
						return;
					}
					userId = message.mentions.members.first().id;
					messagePrefix = 'This user has';
				}
				else if (!Object.prototype.hasOwnProperty.call(userData, userId)) {
					message.channel.send('this user isn\'t part of some dumb deal lmao');
					return;
				}

				const userTimeInSeconds = userData[userId].totalTimeInSeconds;
				const hours = Math.floor(userTimeInSeconds / 3600);
				const minutes = Math.floor((userTimeInSeconds % 3600) / 60);
				message.channel.send(messagePrefix + ' slaved for ' + hours + pluralize(' hour', hours) + ' and ' + minutes + pluralize(' minute', minutes));
			}
		});
	},
};
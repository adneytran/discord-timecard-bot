const { prefix } = require('../config.json');

module.exports = {
	name: 'clockout',
	description: 'clocking user out',
	execute(message) {
		const fs = require('fs');
		const userFileName = '/tmp/userTimeCard.json';

		fs.readFile(userFileName, 'utf8', (err, jsonString) => {
			if (err) {
				console.log('File read failed:', err);
				return;
			}
			else {
				const userData = JSON.parse(jsonString.toString());
				const userId = message.author.id;
				if (userData[userId] == undefined) {
					message.channel.send(`You first need to register with the ${prefix}addtoclock command`);
					return;
				}
				if (!userData[userId].isClockedIn) {
					message.channel.send('You are not clocked in');
					return;
				}

				userData[userId].isClockedIn = false;
				userData[userId].timeCardData[userData[userId].timeCardData.length - 1].clockOutTime = message.createdAt;

				let totalTimeInSeconds = 0;

				for(const t in userData[userId].timeCardData) {
					const startDate = new Date(userData[userId].timeCardData[t].clockInTime);
					const endDate = new Date(userData[userId].timeCardData[t].clockOutTime);
					totalTimeInSeconds += ((endDate.getTime() - startDate.getTime()) / 1000);
				}
				userData[userId].totalTimeInSeconds = totalTimeInSeconds;

				message.channel.send('Successfully clocked out');

				const jsonUserData = JSON.stringify(userData, null, 4);
				fs.writeFile(userFileName, jsonUserData, err => {
					if (err) {
						console.log('Error writing file', err);
					}
				});
			}
		});
	},
};
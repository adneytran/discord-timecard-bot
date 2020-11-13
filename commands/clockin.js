const { prefix } = require('../config.json');

module.exports = {
	name: 'clockin',
	description: 'clocking user in',
	execute(message) {
		const fs = require('fs');
		const userFileName = './userTimeCard.json';

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
				if (userData[userId].isClockedIn) {
					message.channel.send('You are already clocked in');
					return;
				}

				userData[userId].isClockedIn = true;
				userData[userId].timeCardData.push({
					clockInTime: message.createdAt,
					clockOutTime: null });
				const jsonUserData = JSON.stringify(userData, null, 4);
				message.channel.send('Successfully clocked in');
				fs.writeFile(userFileName, jsonUserData, err => {
					if (err) {
						console.log('Error writing file', err);
					}
					else {
						console.log('Successfully wrote file');
					}
				});
			}
		});
	},
};
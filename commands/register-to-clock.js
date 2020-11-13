module.exports = {
	name: 'addtoclock',
	description: 'Adds the user to the time clock',
	execute(message) {
		const fs = require('fs');
		const userFileName = './userTimeCard.json';
		let userData;

		fs.readFile(userFileName, 'utf8', (err, jsonString) => {
			if (err) {
				console.log('File read failed:', err);
				return;
			}
			else {
				userData = JSON.parse(jsonString.toString());
				if (Object.prototype.hasOwnProperty.call(userData, message.author.id)) {
					message.channel.send('You are already registered in the system.');
					return;
				}
				userData[message.author.id] = ({
					totalTimeInSeconds: 0,
					timeCardData: [],
					isClockedIn: false });
				message.channel.send('Successfully registered to the Gaming Enslavement Program');
				const jsonUserData = JSON.stringify(userData, null, 4);
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
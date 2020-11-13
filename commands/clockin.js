const { prefix, params } = require('../config.json');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	Bucket: 'discordtimecardbot',
});
module.exports = {
	name: 'clockin',
	description: 'clocking user in',
	execute(message) {
		delete params['Body'];
		s3.getObject(params, function(error, data) {
			if (error != null) {
				console.log('Failed to retrieve an object: ' + error);
			}
			else {
				const userData = JSON.parse(data.Body.toString('utf-8'));
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
					clockOutTime: null,
				});

				const jsonUserData = JSON.stringify(userData, null, 4);
				const fs = require('fs');

				fs.writeFileSync('./userTimeCard.json', jsonUserData, err => {
					if (err) {
						console.log('Error writing file', err);
					}
				});

				params.Body = fs.readFileSync('./userTimeCard.json');
				s3.upload(params, function(err, data1) {
					if (err) {
						throw err;
					}
					console.log(`File uploaded successfully. ${data1.Location}`);
				});
				message.channel.send('Successfully clocked in');
			}
		});
	},
};
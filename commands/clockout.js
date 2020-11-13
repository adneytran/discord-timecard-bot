const { prefix, params } = require('../config.json');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	Bucket: 'discordtimecardbot',
});

module.exports = {
	name: 'clockout',
	description: 'clocking user out',
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
				if (!userData[userId].isClockedIn) {
					message.channel.send('You are not clocked in');
					return;
				}

				userData[userId].isClockedIn = false;
				userData[userId].timeCardData[userData[userId].timeCardData.length - 1].clockOutTime = message.createdAt;

				let totalTimeInSeconds = 0;

				for (const t in userData[userId].timeCardData) {
					const startDate = new Date(userData[userId].timeCardData[t].clockInTime);
					const endDate = new Date(userData[userId].timeCardData[t].clockOutTime);
					totalTimeInSeconds += ((endDate.getTime() - startDate.getTime()) / 1000);
				}
				userData[userId].totalTimeInSeconds = totalTimeInSeconds;

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
				message.channel.send('Successfully clocked out');
			}
		});
	},
};
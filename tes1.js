const testing = require('./aws-files-s3.js');
// const { params } = require('./config.json');

const params = {
	Bucket: 'discordtimecardbot',
	Key: 'userTimeCard.json',
};

testing.uploadFile(params);
// testing.downloadFile(params);
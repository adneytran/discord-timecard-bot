require('dotenv').config();
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');

// create a new Discord client
const client = new Discord.Client();
const { prefix } = require('./config.json');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) {
		return;
	}
	// takes off the prefix with slice, trims trailing and leading white spaces,
	// and splits arguments (separated by spaces) into an array
	const args = message.content.slice(prefix.length).trim().split(/ +/);

	// since the first index of the array is the command,
	// take it out of the args array and store it
	const commandName = args.shift().toLowerCase();
	if (!client.commands.has(commandName)) {
		return;
	}
	const command = client.commands.get(commandName);
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command');
	}
});

// login to Discord with your app's token
console.log(process.env);
client.login(process.env.DISCORD_TOKEN);


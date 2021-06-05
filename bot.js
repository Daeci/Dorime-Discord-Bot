const Discord = require('discord.js');
const { tokenDorime, adminID } = require('F:\\secrets.json');
const { prefix } = require('./config.json');
const fs = require('fs');

const cooldowns = new Discord.Collection();
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

let commandFileList = []; // [folder, file]
commandFolderList.forEach(folder => fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js')).forEach(file => commandFileList.push([folder, file])));

for (const file of commandFileList) {
    const command = require(`./commands/${file[0]}/${file[1]}`);
    bot.commands.set(command.name, command);
}

bot.on('ready', () => {
    console.log('Bot client logged in.');
    bot.user.setPresence({
        status: "online",
        game: {
            name: "you",
            type: "WATCHING" // PLAYING, WATCHING, LISTENING, STREAMING
        }
    });
});

bot.login(tokenDorime);

bot.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.channel.type !== 'text') return message.channel.send('I do not respond to commands in DMs!');

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!bot.commands.has(command)) return;

    const commandObject = bot.commands.get(command);

    if (!cooldowns.has(commandObject.name)) {
        cooldowns.set(commandObject.name, new Discord.Collection());
    }

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(2)} more second(s) before reusing \`${commandObject.name}\`.`);
        }
    }
    else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        if (commandObject.auth === 'admin' && message.author.id != adminID)
            message.reply('insufficient permission to use that command.');
        else if (command === 'help')
            commandObject.execute(message, args, commandFileList);
        else
            commandObject.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('error executing command.');
    }
});

bot.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
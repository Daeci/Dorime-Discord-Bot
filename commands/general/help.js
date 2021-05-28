/* CONFIG SETUP */
const Discord = require('discord.js');
const { prefix } = require('../../config.json');
const { DiscordAPIError } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays list of available commands',
    use: `\`${prefix}help\`\n
          \`${prefix}help [command]\``,
    type: 'general',
    auth: 'public',
    cooldown: 5,
    execute(message, args, commandFileList) {
        if (args.length > 1) return message.reply('too many arguments');

        if (args.length === 0) {
            let generalCommands = [], bdoCommands = [], adminCommands = [];
            commandFileList.forEach(element => {
                const command = require(`../${element[0]}/${element[1]}`);
                switch (element[0]) { // element[0] = command folder
                    case 'general':
                        generalCommands.push(command);
                        break;
                    case 'bdo':
                        bdoCommands.push(command);
                        break;
                    case 'admin':
                        adminCommands.push(command);
                        break;
                }
            });

            /* Folder list:
             * admin, bdo, general
             */ 
            const embed = new Discord.MessageEmbed()
                .setColor('AQUA')
                .setAuthor('Black Rober')
                .setTitle('Commands List')
                .addField('**General**', `${publicCommands}`)
                .addField('**BDO**', `${adminCommands}`)
                .addField('**Admin**', `${adminCommands}`)
                .setTimestamp();

            return message.channel.send(embed);
        }

        // calling help for a command
        commandFileList.forEach(element => {
            if (element[1].includes(args[0])) { // args[0] = command name
                const command = require(`../${element[0]}/${element[1]}`);
                const embed = new Discord.MessageEmbed()
                    .setColor('AQUA')
                    .setAuthor('Black Rober Command Manual')
                    .setTitle(`${command.name}`)
                    .setDescription(`${command.description}`)
                    .addField('Uses:', `${command.use}`, true)
                    .setTimestamp();

                return message.channel.send(embed);
            }
        });
    }
}
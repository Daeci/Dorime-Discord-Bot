const { prefix } = require('../../config.json');

/* DATABASE SETUP */
const { database } = require('F:\\secrets.json');
const mysql = require('mysql');

const pool = mysql.createPool({
    host: database.host,
    user: database.username,
    password: database.password,
    database: database.db
});

module.exports = {
    name: 'rng',
    description: 'Master command for enhancing database.',
    use: `\`${prefix}rng\``,
    type: 'bdo',
    auth: 'public',
    cooldown: 5,
    execute(message, args) {
        if (args.length === 0) return message.reply('not enough arguments.');
        if (args.length > 1) return message.reply('too many arguments.');

        const user = getUserFromMention(args[]);
    }
}

function getUserFromMention(mention) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return id;
}
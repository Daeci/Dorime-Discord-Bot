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
    name: 'gear',
    description: 'Produces saved gear pic link for the user if there is one in the database.',
    use: `\`${prefix}gear [link]\`\n
          \`${prefix}gear [@user]\``,
    type: 'bdo',
    execute(message, args) {
        if (args.length === 0) return message.reply('not enough arguments.');
        if (args.length > 1) return message.reply('too many arguments.');

        const user = getUserFromMention(args[0]);

        // a proper mention
        if (user) {
            pool.query(`SELECT URL FROM Gear WHERE UserID=${user}`, (error, result) => {
                if (error) throw error;
                if (result.length > 0) Object.keys(result).forEach(key => { message.channel.send(result[key].URL); });
                else message.channel.send(`That user does not have an entry in the database.`);
            });
        }
        else {
            if (isURL(args[0])) {
                const link = args[0];
                pool.query(`SELECT UserID FROM Gear WHERE UserID=${message.author.id}`, (error, result) => {
                    if (error) throw error;

                    // if that user is found in the database
                    if (result.length > 0) {
                        pool.query(`UPDATE Gear SET URL='${link}' WHERE UserID='${message.author.id}'`, (error) => {
                            if (error) throw error;
                            message.channel.send('Successfully updated.');
                        });
                    }
                    else {
                        pool.query(`INSERT INTO Gear (UserID, URL) VALUES ('${message.author.id}', '${link}')`, (error) => {
                            if (error) throw error;
                            message.channel.send('Successfully added.');
                        });
                    }
                });
            }
            else {
                message.reply('invalid link.');
            }
        }
    }
};

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

function isURL(str) {
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) { return true; }
    else { return false; }
}
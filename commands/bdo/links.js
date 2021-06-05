const { prefix } = require('../../config.json');

module.exports = {
    name: 'links',
    description: 'Provides links for various bdo information.',
    use: `\`${prefix}links list\` for a list of available links`,
    type: 'bdo',
    auth: 'public',
    cooldown: 5,
    execute(message, args) {
        
    }
}
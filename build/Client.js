const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const {
    readdirSync
} = require('fs');
const config = require('../config/config');
const musicUtil = require('../util/Music');
module.exports = class ExampleClient extends Client {
    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
            ws: {
                properties: {
                    $browser: 'Discord iOS'
                },
                intents: Intents.ALL
            }
        });

        this.commands = new Collection();

        this.cooldowns = new Collection();

        this.queue = new Map();

        this.songs = new Array();

        this.config = config;

        this.musicUtil = musicUtil;
    }

    generateCommands(group, prefix) {
        let commandsListed = '';
        const folder = readdirSync(`./commands/${group}`);

        for (const command of folder) {
            commandsListed += ' `' + command.split('.')[0] + '`\n';
        }

        commandsListed = commandsListed.slice(0, -1);
        return commandsListed;
    }
}
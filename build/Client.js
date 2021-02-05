const { Client, Collection, Intents } = require('discord.js');
const config = require('../config/config');
module.exports = class DiscordBot extends Client {
    constructor(options = {}) {
        super({
            disableMentions: 'everyone',
            ws: {
                intents: Intents.ALL
            }
        });

        this.commands = new Collection();

        this.cooldowns = new Collection();

        this.queue = new Map();

        this.config = config;
    }
}
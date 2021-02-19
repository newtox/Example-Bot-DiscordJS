const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'help',
    description: 'get a list of all commands',
    usage: '-',
    args: false,
    guildOnly: false,
    developerOnly: false,
    cooldown: 5,
    group: 'Info',
    aliases: ['commands'],
    async execute(message, args, client) {
        if (args[0] && args !== []) {
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return undefined;
            return message.channel.send(
                '```diff\n' +
                '\n' +
                '+ Name: ' + command.name +
                '\n' +
                '+ Description: ' + command.description +
                '\n' +
                '+ Usage: ' + command.usage +
                '\n' +
                '+ Aliases: ' + command.aliases.join(', ') +
                '\n' +
                '```'
            );
        } else {
            const embed = new MessageEmbed()
                .setColor(client.config.MAINCOLOR)
                .setTitle('Help Command')
                .setTimestamp()
                .setThumbnail(client.user.avatarURL({
                    dynamic: true,
                    format: 'png'
                }))
                .addFields({
                    name: 'Developer',
                    value: client.generateCommands('developer', client.config.PREFIX),
                    inline: false
                }, {
                    name: 'Fun',
                    value: client.generateCommands('fun', client.config.PREFIX),
                    inline: false
                }, {
                    name: 'Info',
                    value: client.generateCommands('info', client.config.PREFIX),
                    inline: false
                }, {
                    name: 'Moderation',
                    value: client.generateCommands('moderation', client.config.PREFIX),
                }, {
                    name: 'Music',
                    value: client.generateCommands('music', client.config.PREFIX),
                    inline: false
                });
            return message.channel.send(embed);
        }
    }
}
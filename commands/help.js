const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'get a list of all commands',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    aliases: ['commands'],
    async execute(message, args, client) {
        if (args[0] && args !== []) {
            const command = client.commands.get(args[0]);
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
                .setColor(0xDD4444)
                .setTitle('Help Command')
                .setDescription(client.commands.map(cmd => '```diff\n' + '- ' + cmd.name + '```').join('\n'))
                .setTimestamp();
            return message.channel.send(embed);
        }
    }
}
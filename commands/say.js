module.exports = {
    name: 'say',
    description: 'say something as the bot',
    usage: '<arguments>',
    args: true,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    aliases: ['speak', 'talk'],
    async execute(message, args, client) {
        if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
            message.delete();
            return message.channel.send(args.join(' '));
        } else {
            return message.channel.send(args.join(' '));
        }
    }
}

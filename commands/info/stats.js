const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'stats',
    description: 'displays information about me',
    usage: '-',
    args: false,
    guildOnly: false,
    developerOnly: false,
    cooldown: 5,
    group: 'Info',
    aliases: ['botinfo', 'info', 'invite'],
    async execute(message, args, client) {
        const owner = client.users.cache.get(client.config.OWNER);
        const embed = new MessageEmbed()
            .setColor(client.config.MAINCOLOR)
            .setTimestamp()
            .setThumbnail(client.user.avatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }))
            .setAuthor(owner.tag, owner.avatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
            }), 'http://discord.com/users/' + owner.id)
            .addFields({
                name: 'Ping',
                value: client.ws.ping + 'ms',
                inline: false
            }, {
                name: 'Invite',
                value: await client.generateInvite({
                    permissions: ['ADMINISTRATOR']
                }),
                inline: false
            }, {
                name: 'Servers',
                value: client.guilds.cache.size,
                inline: false
            }, {
                name: 'Users',
                value: client.users.cache.size,
                inline: false
            })
        return message.channel.send(embed);
    }
}
module.exports = {
    name: 'ban',
    description: 'ban someone from your server',
    usage: '<member> [reason]',
    args: true,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Moderation',
    aliases: ['fuckoff'],
    async execute(message, args, client) {
        const author = message.member;
        const victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const bot = message.guild.me;
        let res = args.slice(1).join(' ');

        if (!bot.hasPermission('BAN_MEMBERS')) return message.channel.send('I do not have the permission to ban someone, make sure I have the proper permissions!');
        if (!author.hasPermission('BAN_MEMBERS')) return message.channel.send('You do not have the required permissions to use this command!');
        if (!victim) return message.channel.send('You need to mention someone you want to ban.');
        if (!victim.bannable) return message.channel.send('I do not have the permission to ban this member, make sure I have a higher position than them!');
        if (!reason) reason = 'No reason entered.';

        try {
            victim.ban({
                reason: res
            });
            return message.channel.send(`🔨 I banned ${victim.user.tag} (${victim.user.id}) from this server.`)
        } catch (error) {
            return message.channel.send(`There was an error while trying to ban this member.\n` + error);
        }
    }
}
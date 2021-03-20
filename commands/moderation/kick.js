module.exports = {
    name: 'kick',
    description: 'kick someone from your server',
    usage: '<member> [reason]',
    args: true,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Moderation',
    aliases: ['getout'],
    async execute(message, args, client) {
        const author = message.member;
        const victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const bot = message.guild.me;
        let reason = args.slice(1).join(' ');

        if (!bot.permissions.has('KICK_MEMBERS')) return message.channel.send('I do not have the permission to kick someone, make sure I have the proper permissions!');
        if (!author.permissions.has('KICK_MEMBERS')) return message.channel.send('You do not have the required permissions to use this command!');
        if (!victim) return message.channel.send('You need to mention someone you want to kick.');
        if (!victim.kickable) return message.channel.send('I do not have the permission to kick this member, make sure I have a higher position than them!');
        if (!reason) reason = 'No reason entered.';

        try {
            victim.kick(reason);
            return message.channel.send(`🚪 I kicked ${victim.user.tag} (${victim.user.id}) from this server.`);
        } catch (error) {
            return message.channel.send(`There was an error while trying to kick this member.\n` + error);
        }
    }
}
module.exports = {
    name: 'clear',
    description: 'clear messages in a text channel',
    usage: '<number>',
    args: true,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Moderation',
    aliases: ['clean', 'purge'],
    async execute(message, args, client) {
        const author = message.member;
        const bot = message.guild.me;
        const clearAmount = args[0];

        if (!bot.permissions.has('MANAGE_MESSAGES')) return message.channel.send('I do not have the permission to clear messages, make sure I have the proper permissions!');
        if (!author.permissions.has('MANAGE_MESSAGES')) return message.channel.send('You do not have the required permissions to use this command!');
        if (!clearAmount) return message.channel.send('You need to enter an amount of messages for me to clear.');
        if (isNaN(clearAmount) || clearAmount.includes('-') || clearAmount.includes(',') || clearAmount.includes('.')) return message.channel.send('You need to enter an amount of messages for me to clear.');

        await message.delete();

        const deletedMessages = await message.channel.bulkDelete(deleteCount).catch(async error => {
            if (error.message === 'You can only bulk delete messages that are under 14 days old.') {
                return message.channel.send('You can only bulk delete messages that are under 14 days old.');
            }
        });

        if (deletedMessages.size === undefined) return undefined;

        const deleted = await message.channel.send(`I deleted ${deletedMessages.size} messages.`);

        setTimeout(async () => {
            deleted.delete();
        }, 2000);
    }
}
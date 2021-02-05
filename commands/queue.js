module.exports = {
    name: 'queue',
    description: 'display the queue for your current server',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    aliases: ['q'],
    execute(message, args, client) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing');
        return message.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
    `);
    }
}
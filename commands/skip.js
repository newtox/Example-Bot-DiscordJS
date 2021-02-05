module.exports = {
    name: 'skip',
    description: 'skip the music',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    aliases: [],
    async execute(message, args, client) {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you');
        if (message.guild.me.permissions.has('ADD_REACTIONS')) {
            serverQueue.connection.dispatcher.end();
            await message.react('⏩');
        } else {
            serverQueue.connection.dispatcher.end();
            return message.channel.send('⏩ Skipped the song for you!');

        }
    }
}
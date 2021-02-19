module.exports = {
    name: 'pause',
    description: 'pause the music',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Music',
    aliases: [],
    async execute(message, args, client) {
        const serverQueue = client.queue.get(message.guild.id);
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            if (message.guild.me.permissions.has('ADD_REACTIONS')) {
                serverQueue.connection.dispatcher.pause();
                await message.react('⏸️');
            } else {
                serverQueue.connection.dispatcher.pause();
                return message.channel.send('⏸ Paused the music for you!');
            }
        } else {
            return message.channel.send('There is nothing playing.');
        }
    }
}
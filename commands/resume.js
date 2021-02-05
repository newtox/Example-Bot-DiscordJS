module.exports = {
    name: 'resume',
    description: 'resume the music',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    aliases: ['unpause'],
    async execute(message, args, client) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            if (message.guild.me.permissions.has('ADD_REACTIONS')) {
                serverQueue.connection.dispatcher.resume();
                await message.react('⏯️');
            } else {
                serverQueue.connection.dispatcher.resume();
                return message.channel.send('⏯️ Resumed the music for you!');
            }
        } else {
            return message.channel.send('There is nothing playing');
        }
    }
}
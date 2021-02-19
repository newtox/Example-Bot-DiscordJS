module.exports = {
    name: 'stop',
    description: 'stop the music',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Music',
    aliases: [],
    async execute(message, args, client) {
        const {
            channel
        } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');

        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');

        serverQueue.songs = [];

        if (message.guild.me.permissions.has('ADD_REACTIONS')) {
            serverQueue.connection.dispatcher.end();
            await message.react('⏹️');
        } else {
            serverQueue.connection.dispatcher.end();
            return message.channel.send('⏹️ Stopped the music for you!');
        }
    }
}
module.exports = {
    name: 'np',
    description: 'see the current song playing',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Music',
    aliases: ['np'],
    async execute(message, args, client) {
        const serverQueue = client.queue.get(message.guild.id);

        if (!serverQueue) return message.channel.send('There is nothing playing.');

        const bar = new client.musicUtil.ProgressBar(serverQueue.connection.player.dispatcher.streamTime, serverQueue.songs[0].durationSecs, 35);
        const song = bar.create();

        return message.channel.send('**' + serverQueue.songs[0].title + '**' + '\n' + song);
    }
}
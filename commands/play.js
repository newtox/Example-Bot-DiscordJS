const { Util } = require('discord.js');
const ytdl = require('ytdl-core');
module.exports = {
    name: 'play',
    description: 'play music in your voice channel',
    usage: '<youtube video link>',
    args: true,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    aliases: ['p'],
    async execute(message, args, client) {
        const { channel } = message.member.voice;
        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

        const serverQueue = message.client.queue.get(message.guild.id);
        const video = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlist = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/g;
        const videoTest = video.test(args[0]);
        const playlistTest = playlist.test(args[0]);
        if (playlistTest) return message.channel.send('You need to enter a youtube **video** url!');
        if (!videoTest) return message.channel.send('You need to enter a youtube **video** url!');
        const songInfo = await ytdl.getInfo(args[0]);
        const song = {
            id: songInfo.videoDetails.video_id,
            title: Util.escapeMarkdown(songInfo.videoDetails.title),
            url: songInfo.videoDetails.video_url
        };

        if (serverQueue) {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 2,
            playing: true
        }
        message.client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async song => {
            const queue = message.client.queue.get(message.guild.id);
            if (!song) {
                queue.voiceChannel.leave();
                message.client.queue.delete(message.guild.id);
                return;
            }

            const dispatcher = queue.connection.play(ytdl(song.url))
                .on('finish', () => {
                    queue.songs.shift();
                    play(queue.songs[0]);
                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(queue.volume / 5);
            queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
        };

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            message.client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(`I could not join the voice channel: ${error}`);
        }
    }
};
const {
    Util,
    MessageEmbed
} = require('discord.js');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'play music in your voice channel',
    usage: '<youtube video link>',
    args: true,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Music',
    aliases: ['p'],
    async execute(message, args, client) {
        const {
            channel
        } = message.member.voice;

        if (!channel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
        const permissions = channel.permissionsFor(message.client.user);

        if (!permissions.has('CONNECT')) return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
        if (!permissions.has('SPEAK')) return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');

        const serverQueue = client.queue.get(message.guild.id);

        let ServerIcon = '';

        if (message.guild.iconURL()) {
            ServerIcon = message.guild.iconURL({
                dynamic: true,
                size: 1024,
                format: 'png'
            });
        }

        const video = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlist = /^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/g;
        const videoTest = video.test(args[0]);
        const playlistTest = playlist.test(args[0]);

        if (playlistTest) return message.channel.send('You cannot enter a playlist url!');
        if (!videoTest) return message.channel.send('You need to enter a youtube video url!');

        const songInfo = await ytdl.getInfo(args[0]);
        const song = {
            id: songInfo.videoDetails.video_id,
            title: Util.escapeMarkdown(songInfo.videoDetails.title),
            url: songInfo.videoDetails.video_url,
            thumbnail: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
            duration: new Date(songInfo.player_response.videoDetails.lengthSeconds * 1000).toISOString().substr(11, 8),
            durationSecs: songInfo.player_response.videoDetails.lengthSeconds * 1000,
            channel: songInfo.videoDetails.author.name,
            requester: message.author
        }

        if (serverQueue) {
            serverQueue.songs.push(song);

            const embed = new MessageEmbed()
                .setColor(client.config.MAINCOLOR)
                .setThumbnail(ServerIcon)
                .setImage(song.thumbnail)
                .setTimestamp()
                .setDescription(`✅ [**${song.title}**](${song.url}) has been added to the queue!`)
                .addFields({
                    name: 'Requested by',
                    value: song.requester,
                    inline: true
                }, {
                    name: 'Duration',
                    value: song.duration,
                    inline: true
                }, {
                    name: 'Youtube Channel',
                    value: song.channel,
                    inline: true
                });
            return message.channel.send(embed);
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: channel,
            connection: null,
            songs: [],
            volume: 2,
            playing: true
        }

        client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async song => {
            const queue = client.queue.get(message.guild.id);
            if (!song) {
                if (client.songs.find(msg => msg.guild === message.guild.id)) {
                    client.songs.find(msg => msg.guild === message.guild.id).message.delete();
                    const index = client.songs.indexOf(client.songs.find(msg => msg.guild === message.guild.id));
                    if (index > -1) client.songs.splice(index, 1);
                }
                queue.voiceChannel.leave();
                client.queue.delete(message.guild.id);
                return undefined;
            }

            const dispatcher = queue.connection.play(ytdl(song.url))
                .on('finish', () => {
                    queue.songs.shift();
                    play(queue.songs[0]);
                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(queue.volume / 5);

            const embed = new MessageEmbed()
                .setColor(client.config.MAINCOLOR)
                .setThumbnail(ServerIcon)
                .setImage(song.thumbnail)
                .setTimestamp()
                .setDescription(`🎶 [**${song.title}**](${song.url})`)
                .addFields({
                    name: 'Requested by',
                    value: song.requester,
                    inline: true
                }, {
                    name: 'Duration',
                    value: song.duration,
                    inline: true
                }, {
                    name: 'Youtube Channel',
                    value: song.channel,
                    inline: true
                });

            if (client.songs.find(msg => msg.guild === message.guild.id)) {
                client.songs.find(msg => msg.guild === message.guild.id).message.delete();
                const index = client.songs.indexOf(client.songs.find(msg => msg.guild === message.guild.id));
                if (index > -1) client.songs.splice(index, 1);
            }

            const playedSong = await message.channel.send(embed);

            client.songs.push({
                message: playedSong,
                guild: message.guild.id
            });
        }

        try {
            const connection = await channel.join();
            queueConstruct.connection = connection;
            play(queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            client.queue.delete(message.guild.id);
            await channel.leave();
            return message.channel.send(`I could not join the voice channel: ${error}`);
        }
    }
}
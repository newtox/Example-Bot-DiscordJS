const {
    MessageEmbed
} = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'display the queue for your current server',
    usage: '-',
    args: false,
    guildOnly: true,
    developerOnly: false,
    cooldown: 5,
    group: 'Music',
    aliases: ['q'],
    async execute(message, args, client) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');

        let ServerIcon = '';

		if (message.guild.iconURL()) {
			ServerIcon = message.guild.iconURL({
				dynamic: true,
				size: 1024,
				format: 'png'
			});
		}

        const embed = new MessageEmbed()
            .setColor(client.config.MAINCOLOR)
            .setThumbnail(ServerIcon)
            .setTitle('__**Song queue:**__')
            .setDescription(serverQueue.songs.map((song, index) => `\`\`${index + 1}\`\` ${song.requester} \`\`[${song.duration}]\`\` [${song.title}](${song.url})`).join('\n').substr(0, 2000));
        return message.channel.send(embed);
    }
}
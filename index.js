const DiscordBot = require('./build/Client');
const { Collection } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');
const client = new DiscordBot();
const config = require('./config/config');

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(join(__dirname, 'commands', `${file}`));
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log(`Logged in as: ${client.user.tag}`);
    client.user.setStatus('online');
    client.user.setActivity(client.config.PREFIX + 'help', {
        type: 'PLAYING'
    });
});

client.on('message', message => {
    if (!message.content.startsWith(client.config.PREFIX) || message.author.bot) return;
    const args = message.content.slice(client.config.PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (command.guildOnly && message.channel.type !== 'text') return message.channel.send('I can\'t execute that command inside DMs!');
    if (command.developerOnly && message.author.id !== client.config.OWNER) return message.channel.send('You are not allowed to use this command!');
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments!`;
        if (command.usage) reply += `\nThe proper usage would be: \`${client.config.PREFIX}${command.name} ${command.usage}\``;
        return message.channel.send(reply);
    }

    if (!client.cooldowns.has(command.name)) {
        client.cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command!`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(async () => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, client);
    } catch (error) {
        return message.channel.send('There was an error trying to execute that command!\n' + error);
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (newState.guild.me.voice.channel === null) {
        const serverQueue = client.queue.get(oldState.guild.id);
        if (serverQueue) {
            client.queue.delete(oldState.guild.id);
        }
    }
});

client.login(config.TOKEN);
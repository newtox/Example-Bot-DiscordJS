const fetch = require('node-fetch');
module.exports = {
    name: 'eval',
    description: 'eval code',
    usage: '<code>',
    args: true,
    guildOnly: false,
    developerOnly: true,
    cooldown: 5,
    group: 'Developer',
    aliases: ['ev'],
    async execute(message, args, client) {
        function clean(text) {
            if (typeof text === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@​/g, '@​' + String.fromCharCode(8203));
            } else {
                return text;
            }
        }

        try {
            let code = args.join(' ');
            let evaled = eval(code);
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            evaled = (evaled).replace(client.config.TOKEN, 'token when?!?!?');

            if (evaled.length > 2000) {
                const options = {
                    method: 'POST',
                    body: clean(evaled),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }

                let result = await fetch.default(`https://haste.newtox.de/documents`, options);
                result = await result.json();
                return message.channel.send('https://haste.newtox.de/' + result.key);
            } else {
                return message.channel.send('```js\n' + evaled + '```');
            }
        } catch (error) {
            return message.channel.send('```js\n' + error + '```');
        }
    }
}
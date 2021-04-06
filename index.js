const Discord = require('discord.js');
const fs = require('fs');
const botconfig = require("./botconfig.json");
const { prefix, token } = require('./botconfig.json');

const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands')
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("the market crash", { type: 'WATCHING' });
});

bot.on("message", async message => {
    let args = message.content.slice(prefix.length).split(/ +/);
    let commandName = args[0].toLowerCase();

    if (!bot.commands.has(commandName)) return;

    const command = bot.commands.get(commandName)
        || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command');
    }
})

bot.login(botconfig.token);

const Discord = require('discord.js');
const fs = require('fs');
const botconfig = require("./botconfig.json");
const { prefix, token } = require('./botconfig.json');

const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

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
    let commandName = args.shift().toLowerCase();

    const command = bot.commands.get(commandName)
        || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const { cooldowns } = bot;

    if (!cooldowns.has(command.name)) {
    	cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
    	const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    	if (now < expirationTime) {
    		const timeLeft = (expirationTime - now) / 1000;
    		return message.reply(`Hold your horses homeboy. This ain't a charity.`);
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command');
    }
})

bot.login(botconfig.token);

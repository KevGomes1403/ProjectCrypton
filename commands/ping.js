module.exports = {
    name: "ping",
    description: "Checks for status of bot",
    execute(message, args) {
        message.channel.send('Stfu');
    }
}
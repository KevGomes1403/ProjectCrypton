const Discord = require('discord.js');
const axios = require('axios').default;
const _ = require('lodash');

const BASE_URL = "https://pro-api.coinmarketcap.com/";

const getQuote = (sym) => {
    try {
        return axios.get(BASE_URL + "v1/cryptocurrency/quotes/latest", {
            headers: {
                "X-CMC_PRO_API_KEY": "a5233634-1fb5-4bea-84c6-cbaae7b4421c"
            },
            params: {
                "symbol": sym
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const roundToTwoDecimal = (tex) => {
  let texNum = parseFloat(tex) * 10000;
  texNum = Math.round(texNum) / 10000;
  return texNum.toString();
}

module.exports = {
    name: 'quote',
    aliases: ['coin', 'stats'],
    cooldown: 5,
    description: 'Provides quote for a given cryptocurrency',
    execute(message, args) {
        const asyncApiCall = async (cn) => {
            try {
                const coin = cn.toUpperCase();

                const values = await getQuote(coin);
                const valData = 'data.data.' + coin;

                const price = '$' + roundToTwoDecimal(_.get(values, valData + '.quote.USD.price'));
                const name = _.get(values, valData + '.name');
                const symbol = _.get(values, valData + '.symbol');
                const change = _.get(values, valData + '.quote.USD.percent_change_24h');

                console.log(values.data.data);

                let marketStatusCol = '#00ff00';
                if (parseInt(change) < 0) {
                  marketStatusCol = '#ff0000';
                }

                const url = 'https://coinmarketcap.com/currencies/' + name.toLowerCase() + '/';

                const quoteEmbed = new Discord.MessageEmbed()
                  .setColor(marketStatusCol)
                  .setTitle(name)
                  .setURL(url)
                  .setDescription(symbol)
                  .addFields(
                    { name: 'Price', value: price, inline: true },
                    { name: '24 hr Change', value: change + '%', inline: true }
                  )
                  .setTimestamp()

                message.channel.send(quoteEmbed);
            } catch (error) {
                console.log(error);
                message.channel.send('error');
            }
        }

        asyncApiCall(args[0]);
    }
}

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


module.exports = {
    name: 'quote',
    description: 'Provides quote for a given cryptocurrency',
    execute(message, args) {
        const asyncApiCall = async (coin) => {
            try {
                const values = await getQuote(coin);
                const valData = 'data.data.' + coin;
                const price = _.get(values, valData + '.quote.USD.price');
                const name = _.get(values, valData + '.name');
                const symbol = _.get(values, valData + '.symbol');

                console.log(values.data.data);

                const quoteEmbed = new Discord.MessageEmbed()
                  .setColor('#f2a900')
                  .setTitle(name)
                  .setDescription(symbol)
                  .addFields(
                    { name: 'Price', value: '$' + price },
                  )

                message.channel.send(quoteEmbed);
            } catch (error) {
                console.log(error);
                message.channel.send('error');
            }
        }

        asyncApiCall(args[1]);
    }
}

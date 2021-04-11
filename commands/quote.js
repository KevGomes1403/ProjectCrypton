const Discord = require('discord.js');
const axios = require('axios').default;
const _ = require('lodash');

const { API_KEY, BASE_URL } = require('./apiconfig.json');

const getData = (url, sym) => {
    try {
        return axios.get(BASE_URL + url, {
            headers: {
                "X-CMC_PRO_API_KEY": API_KEY
            },
            params: {
                "symbol": sym
            }
        })
    } catch (error) {
        console.log(error)
    }
}

const roundDecimal = (tex) => {
  let texNum = parseFloat(tex) * 10000;
  texNum = Math.round(texNum) / 10000;
  return texNum.toString();
}

module.exports = {
    name: 'quote',
    aliases: ['coin', 'stats'],
    cooldown: 5,
    description: 'Provides quote for a given cryptocurrency',
    usage: '[Ticker symbol of crypto]',

    execute(message, args) {
        const asyncApiCall = async (cn) => {
            try {
                const coin = cn.toUpperCase();

                const quoteVal = await getData("v1/cryptocurrency/quotes/latest", coin);
                const metaVal = await getData("v1/cryptocurrency/info", coin);
                const valData = 'data.data.' + coin;

                const name = _.get(quoteVal, valData + '.name');
                const price = '$' + roundDecimal(_.get(quoteVal, valData + '.quote.USD.price'));
                const symbol = _.get(quoteVal, valData + '.symbol');
                const change = roundDecimal(_.get(quoteVal, valData + '.quote.USD.percent_change_24h'));
                const image = _.get(metaVal, valData + '.logo');
                const volume = _.get(quoteVal, valData + '.quote.USD.volume_24h');
                const mktCap = '$' + _.get(quoteVal, valData + '.quote.USD.market_cap');

                console.log(quoteVal.data.data.BTC.quote.USD);

                let marketStatusCol = '#00FF7F';
                if (parseInt(change) < 0) {
                  marketStatusCol = '#DC143C';
                }

                const url = 'https://coinmarketcap.com/currencies/' + name.toLowerCase() + '/';

                const quoteEmbed = new Discord.MessageEmbed()
                  .setColor(marketStatusCol)
                  .setTitle(name)
                  .setURL(url)
                  .setDescription(symbol)
                  .setThumbnail(image)
                  .addFields(
                    { name: 'Price', value: price},
                    { name: '24 hr Change', value: change + '%'},
                    { name: 'Market Cap', value: mktCap},
                    { name: 'Volume', value: volume}
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

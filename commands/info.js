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

module.exports = {
  name: 'info',
  description: 'Provides detailed information about a particular coin',
  execute(message, args) {
    const asyncApiCall = async(cn) => {
      try {
        const coin = cn.toUpperCase();

        const metaVal = await getData("v1/cryptocurrency/info", coin);
        const valData = 'data.data.' + coin;

        const infoEmbed = new Discord.MessageEmbed()
          .setColor("#000000")
          .setTitle(_.get(metaVal, valData + '.name'))
          .setDescription(_.get(metaVal, valData + '.description'))
          .setThumbnail(_.get(metaVal, valData + '.logo'))
          .setURL(_.get(metaVal, valData + '.urls.technical_doc[0]'))
          .addFields(
            { name: 'Source Code', value: _.get(metaVal, valData + '.urls.source_code[0]')},
            { name: 'Reddit', value: _.get(metaVal, valData + '.urls.reddit[0]')}
          )

        console.log(metaVal.data.data);
        message.channel.send(infoEmbed);
      } catch (error) {
          console.log(error);
          message.channel.send('error');
      }
    }

    asyncApiCall(args[0]);
  }
}

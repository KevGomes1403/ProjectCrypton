const Discord = require('discord.js');
const axios = require('axios').default;
const _ = require('lodash');

const { API_KEY, BASE_URL } = require('./apiconfig.json');

const getConversion = (count, base, prod) => {
  try {
    return axios.get(BASE_URL + "v1/tools/price-conversion", {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY
      },
      params: {
        "amount": count,
        "symbol": base,
        "convert": prod
      }
    })
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  name: 'convert',
  cooldown: 5,
  description: 'Converts a given cryptocurrency to another currency',

  execute(message, args) {
    const asyncApiCall = async (numCn, baseCn, targetCn) => {
      try {
        const conversionVal = await getConversion(numCn, baseCn.toUpperCase(),
          targetCn.toUpperCase());
        const valData = 'data.data.quote.' + targetCn.toUpperCase()
        const result = _.get(conversionVal, valData + '.price')

        message.channel.send('```java\n' + numCn + ' ' + baseCn.toUpperCase() + ' is '
          + result + ' ' + targetCn.toUpperCase() + '```');
        console.log(conversionVal.data.data);

      } catch (error) {
        console.error(error);
      }
    }

    asyncApiCall(args[0], args[1], args[2]);
  }
}

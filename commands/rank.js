const Discord = require('discord.js');
const axios = require('axios').default;
const _ = require('lodash');

const { API_KEY, BASE_URL } = require('./apiconfig.json');

const getRank = () => {
  try {
    return axios.get(BASE_URL + "v1/cryptocurrency/map", {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY
      },
      params: {
        "limit": 10,
        "sort": "cmc_rank"
      }
    })
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  name: 'rank',
  description: 'Displays a list of the top cryptocurrencies',

  execute(message, args) {
    const asyncApiCall = async() => {
      try {
        const rankVal = await getRank();

        let result = '```js\n';
        for (let i = 0; i < 10; i++) {
          const name = rankVal.data.data[i].name;
          const symbol = rankVal.data.data[i].symbol;
          result +=  i + 1 + '. ' + name + ' (' + symbol + ')\n';
        }
        result += '```';
        message.channel.send(result);

        console.log(rankVal.data.data[1]);
      } catch(error) {
        console.error(error);
      }
    }

    asyncApiCall();
  }
}

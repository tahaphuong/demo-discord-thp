
require('dotenv').config()

/*
 * https://discord.com/api/webhooks/12345678910/T0kEn0fw3Bh00K
 *                                  ^^^^^^^^^^  ^^^^^^^^^^^^ 
 *                                  Webhook ID  Webhook Token
 */

// const whUrl = `https://discord.com/api/webhooks/${process.env.WH_ID}/${process.env.WH_TOKEN}`

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;

let textChannels = []

client.on('ready', () => {
  console.log('ready on set')
  for (let [channelId, channel] of client.channels.cache) {
    if(channel.type == "text")
      textChannels.push(channel)
  }
});

client.on('message', message => {
  if(textChannels.map(item=>item.id).includes(message.channel.id)) {
    let ch = message.channel
    if (message.content == "hello") {
      ch.send(`Welcome to channel ${ch.name}. This channel is for discussions around the topic ${ch.topic || "general"}. Send 'help' to get more instructions.`);
    }
    if (message.content == 'help') {
      ch.send("help cc")
    }
  }
});

client.login(token);



require('dotenv').config()
const axios = require('axios');
/*
 * https://discord.com/api/webhooks/12345678910/T0kEn0fw3Bh00K
 *                                  ^^^^^^^^^^  ^^^^^^^^^^^^ 
 *                                  Webhook ID  Webhook Token
 */

// const whUrl = `https://discord.com/api/webhooks/${process.env.WH_ID}/${process.env.WH_TOKEN}`

const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.BOT_TOKEN;
const GREEN = "0x62e354"

const PREFIX = '--'

let textChannels = []

client.on('ready', () => {
  console.log('ready on set')
  for (let [channelId, channel] of client.channels.cache) {
    if(channel.type == "text")
      textChannels.push(channel)
  }
});

client.on('message', async message => {
  let command = message.content.trim().startsWith(PREFIX) ? message.content.trim().split(PREFIX)[1] : ""
  if (!command) return
  console.log("this is a command")

  let ch = message.channel
  let messInChannel = textChannels.map(item=>item.id).includes(ch.id)
  switch(command) {

    case "help": 
      let data = ''
      for (const [key, value] of Object.entries(commandsGuide)) {
        data += `**${key}**: ${value}` + '\n';
      }
      ch.send(data)
    break

    case "info":
      if(!messInChannel) {
        ch.send("I am a J4F bot created by a random TU Dortmund student! You can find interesting infos here.")
      } else {
        ch.send(`Welcome to channel ${ch.name}, topic ${ch.topic || "general"}.`);
      }
    break

    case "meme":
      try {
        let res = await axios("https://meme-api.herokuapp.com/gimme")
        let data = await res.data 
        let output = memeEmbed(data)
        ch.send({embed: output});

      } catch(err) {
        ch.send("🔌 there's an error: " + err.message)
      }

    break

    case "tudo-meme": 
      try {
        let res = await axios("https://www.instagram.com/tudortmundmemes/?__a=1")
        let src = await res.data
        
        let profilePicUrl = src["graphql"]["user"]["profile_pic_url"]
        let list = src["graphql"]["user"]["edge_owner_to_timeline_media"]["edges"]

        let data = list[Math.floor(Math.random() * list.length)]["node"]

        let output = memeTudoEmbed(data, profilePicUrl)
        console.log(output)
        ch.send({embed: output})

      } catch(err) {
        ch.send("🔌 there's an error: " + err.message)
      }
    break

    default: {
      if(command.startsWith('fa-')) {
        let data = facultyEmbed(command.split('fa-')[1])
        if (!data) {
          ch.send("🤷 The given faculty's name is not available")
        }
        ch.send({ embed: data });
      } else if (command.startsWith('react-')) {
        ch.send("🔨 feature is in development...")
      } else {
        ch.send("🤷 command's not available. Try '--help' to see all commands you can use.")
      }
    }
  }

});

client.login(token);

const commandsGuide = {
  "--help": "💡 show all commands you can use",
  "--info": "🧿 get to know me...",
  "--meme": "🧸 get a random meme ~",
  "--tudo-meme": "😲 get a random meme of @tudortmundmemes",
  "--fa-{your faculty}": "📚 return page of your faculty",
  "--react-{icon_name}": "😀 bot will react your message with the icon name you give. (closest as possible)"
}

const memeEmbed = data => {
  return {
    color: GREEN,
    title: 'Random meme',
    url: data.postLink,
    description: data['title'],
    image: {
      url: data.url,
    },
    timestamp: new Date(),
    footer: {
      text: 'Credit goes to D3vd/Meme_Api',
    }
  }
}

const memeTudoEmbed = (data, profilePicUrl) => {
  return {
    color: GREEN,
    title: 'TUDO meme ' + (data['is_video'] ? "🎞" : "🖼️"),
    url: 'https://www.instagram.com/p/' + data['shortcode'],

    thumbnail: {
      url: data['display_url'],
    },
    description: data['edge_media_to_caption']['edges'][0]['node']['text'],
    image: {
      url: data['display_url'],
    },
    video: {
      url: data['video_url'],
      proxy_url: data['video_url']
    },
    timestamp: new Date(),
    footer: {
      icon_url: profilePicUrl,
      text: 'Credit goes to @tudortmundmemes'
    }
  }
} 

const facultyEmbed = (name) => {
  name = !!name.toLowerCase().match(/informati/) ? "Informatik" : name;
  name = !!name.toLowerCase().match(/physi/) ? "Physik" : null;
  
  if (name == null) {
    return null
  }

  return {
    color: GREEN,
    title: 'Falkutät der ' + name,
    url: 'https://www.tu-dortmund.de/universitaet/fakultaeten/' + name.toLowerCase(),
    author: {
      name: 'hallo-tu-dortmund',
      icon_url: 'https://www.tu-dortmund.de/storages/administration/_processed_/4/7/csm_favicon-600x600_3089266120.png',
    },
    description: 'Webseite:',
    thumbnail: {
      url: 'https://www.tu-dortmund.de/storages/zentraler_bilderpool/_processed_/4/c/csm_Informatik_ITMC_7d25b76437.jpg',
    },
    fields: [
      // {
      //   name: 'Regular field title',
      //   value: 'Some value here',
      // },
    ],
    timestamp: new Date(),
    footer: {}
  }
  
};
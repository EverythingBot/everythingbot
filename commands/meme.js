exports.run = (client, message, args, mongo) => {

  const Discord = require("discord.js");

  var highest = 21;
  var url = "https://www.sheshank.com/memes/" + Math.floor((Math.random() * highest) + 1) + ".jpg";
  const embed = new Discord.RichEmbed()
    .setImage(url);
  message.channel.send({
    embed
  });
}

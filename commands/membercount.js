exports.run = (client, message, args, mongo) => {
  var async = {};
  var i = 0;
  var botCount = 0;
  let bots = message.guild.members.filter(mem => mem.user.bot == true).size;
  message.channel.send({
    "embed": {
      "color": 65299,
      "fields": [{
          "name": "Total members",
          "value": `${message.guild.memberCount}`,
          "inline": true
        },
        {
          "name": "Bot count",
          "value": `${bots}`,
          "inline": true
        },
        {
          "name": "Users",
          "value": `${message.guild.memberCount - bots}`,
          "inline": true
        }
      ]
    }
  });
}

exports.run = (client, message, args, mongo) => {
  var fs = require('fs');
  var helpMenu = {
    embed: {
      color: 3447003,
      description: "EverythingBot, does literally everything (Still in production, currently doesn't do much). Here's the list of commands",
      fields: [{
          name: ":straight_ruler:  Admin/Mod",
          value: "clear, kick, ban, unban, mute, unmute, setprefix, setup, disable"
        },
        {
          name: ":camera:  Image commands",
          value: "poster, sepia, greyscale, invert, flip, mirror, blur, rotate"
        },
        {
          name: ":laughing: Fun commands",
          value: "meme, pickup, roast, mock, kill"
        },
        {
          name: ":briefcase: User commands",
          value: "bal, daily, leaderboard"
        },
        {
          name: ":regional_indicator_t: :regional_indicator_e: :regional_indicator_x: :regional_indicator_t:  commands",
          value: "ping, bigtext, invite, server"
        },
        {
          name: ":thinking: Etc commands",
          value: "credits, membercount"
        }
      ]
    }
  };
  message.channel.send(helpMenu);
}

exports.run = (client, message, args, mongo) => {

  var Jimp = require('jimp');

  if (message.mentions.members.first()) {
    blurFunction(message, args[0], message.mentions.members.first().user.displayAvatarURL);
  } else if (args[1] == null && args[0] != null) {
    blurFunction(message, args[0], message.author.displayAvatarURL);
  } else if (args[0] != null) {
    blurFunction(message, args[0], args[1]);
  } else {
    message.reply(`you've done something wrong! Are you sure you did ${prefix}blur [amount] [link/user]?`);
  }

  function blurFunction(message, amount, im) {
    message.channel.startTyping(1);
    var a = Math.abs(parseInt(amount));
    if (isNaN(a) == false) {
      Jimp.read(im, function(err, image) {
        message.channel.startTyping(1);
        if (err) {
          message.channel.stopTyping();
          console.log(err);
          message.reply('are you sure this is a link?');
        } else {
          image.blur(a, function(err, image) {
            if (err) message.reply(err);
            image.write("/app/tempPic.png", function(err) {
              if (err) throw err;
              message.channel.send("", {
                files: ["/app/tempPic.png"]
              }).then(message.channel.stopTyping());
            });
          });
        }
      });
    } else {
      message.reply(`you've done something wrong! Are you sure you did ${prefix}blur [amount] [link/user]?`);
    }
  }

}

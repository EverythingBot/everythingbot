exports.run = (client, message, args, mongo) => {

  var Jimp = require('jimp');

  if (message.mentions.members.first()) {
    posterFunction(message, args[0], message.mentions.members.first().user.avatarURL);
  } else if (args[1] == null && args[0] != null) {
    posterFunction(message, args[0], message.author.avatarURL);
  } else if (args[0] != null) {
    posterFunction(message, args[0], args[1]);
  } else {
    message.reply(`you've done something wrong! Are you sure you did ${prefix}poster [amount] [link/user]?`);
  }

  function posterFunction(message, f, im) {
    var r = Math.abs(parseFloat(f));
    if (isNaN(r) == false) {
      Jimp.read(im, function(err, image) {
        if (err) {
          console.log(err);
          message.reply('are you sure this is a link?');
        } else {
          message.channel.startTyping(1);
          image.posterize(r, function(err, image) {
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
      message.reply(`you've done something wrong! Are you sure you did ${prefix}poster [intensity] [link/user]?`);
    }
  }

}

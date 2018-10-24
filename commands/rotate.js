exports.run = (client, message, args, mongo) => {

  var Jimp = require('jimp');

  if (message.mentions.members.first()) {
    rotateFunction(message, args[0], message.mentions.members.first().user.displaydisplayAvatarURL);
  } else if (args[1] == null && args[0] != null) {
    rotateFunction(message, args[0], message.author.displayAvatarURL);
  } else if (args[0] != null) {
    rotateFunction(message, args[0], args[1]);
  } else {
    message.reply(`you've done something wrong! Are you sure you did ${prefix}rotate [degrees] [link/user]?`);
  }

  function rotateFunction(message, degrees, im) {
    var p = parseFloat(degrees);
    if (isNaN(p) == false) {
      message.channel.startTyping(1);
      Jimp.read(im, function(err, image) {
        if (err) {
          message.channel.stopTyping();
          console.log(err);
          message.reply('are you sure this is a link?');
        } else {
          image.rotate(p, true, function(err) {
            if (err) {
              message.reply(`you've done something wrong! Are you sure you did ${prefix}rotate [degrees] [link/user]?`);
              throw err;
            }
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
      message.reply(`you've done something wrong! Are you sure you did ${prefix}rotate [degrees] [link/user]?`);
    }
  }
}

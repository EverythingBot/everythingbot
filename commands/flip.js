exports.run = (client, message, args, mongo) => {

  var Jimp = require('jimp');

  if (message.mentions.members.first()) {
    flipFunction(message, message.mentions.members.first().user.avatarURL);
  } else if (args[0] == null) {
    flipFunction(message, message.author.avatarURL);
  } else flipFunction(message, args[0]);

  function flipFunction(message, im) {
    Jimp.read(im, function(err, image) {
      if (err) {
        console.log(err);
        message.reply('are you sure this is a link?');
        //catch(err);
      } else {
        message.channel.startTyping(1);
        image.flip(false, true, function(err, image) {
          image.write("/app/tempPic.png", function(err) {
            if (err) throw err;
            message.channel.send("", {
              files: ["/app/tempPic.png"]
            }).then(message.channel.stopTyping());
          });
        });
      }
    });
  }
}

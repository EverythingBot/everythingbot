exports.run = (client, message, args, mongo) => {

  var Jimp = require("jimp");

  if (message.mentions.members.first()) {
    sepiaFunction(message, message.mentions.members.first().user.avatarURL);
  } else if (args[0] == null) {
    sepiaFunction(message, message.author.avatarURL);
  } else sepiaFunction(message, args[0]);

  function sepiaFunction(message, im) {
    Jimp.read(im, function(err, image) {
      if (err) {
        console.log(err);
        message.reply('are you sure this is a link?');
        //catch(err);
      } else {
        message.channel.startTyping(1);
        image.sepia(function(err, image) {
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

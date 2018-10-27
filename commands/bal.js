exports.run = (client, message, args, mongo) => {

  var pic = "/app/balPic.png"
  var fon = ".fonts/bahnschrift.fnt";
  var fonTwo = ".fonts/FranklinGothicMedium.fnt";
  var UserURL = process.env.USER;
  var ServerURL = process.env.SERVER;
  var Jimp = require("jimp");
  var shortNumber = require('short-number');

  mongo.connect(UserURL, function(err, db) {
    if (err) throw err;
    var dbo = db.db("users");
    var qeury = {};
    var ID;
    if (args[0] == null) {
      ID = message.author.id;
      tags = message.author.tag;
      query = {
        name: message.author.id
      };
    } else {
      if (args[0].toString().includes('@')) {
        if (args[0] != '@here' && args[0] != '@everyone' && args[0] != '@someone') {
          ID = args[0].replace(/[<@!>]/g, '');
          if (client.users.get(ID)) {
            tags = message.guild.member(ID).user.tag;
            query = {
              name: message.guild.member(ID).user.id
            };
          }
        }
      }
    }
    dbo.collection("users").findOne(query, function(err, result) {
      if (err) throw err;
      var cha = result;
      if (cha != null) {
        decide(message, cha.money, cha.xp, cha.level, tags, ID);
        //  makeProfile(message, cha.money, cha.xp, cha.level, tags);
        db.close();
      } else {
        if (args[0] != null) {
          db.close();
          message.reply("this user isn't registered yet, have them try some other commands first!");
        } else {
          message.reply("you haven't been registered yet! Try some other commands first!");
          db.close();
        }
      }
    });
  });

  function decide(mes, money, xp, level, tag, id) {
    mongo.connect(ServerURL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("servers");

      var query = {
        "serverID": message.guild.id
      };

      dbo.collection("servers").find(query).toArray(function(err, result) {
        if(err) throw err;

        var serv = result[0];

        if(serv.balPic == true || serv.balPic == null){
          makeProfile(mes, money, xp, level, tag);
        } else {
          var user = client.users.get(id);
          var bal = {
            "embed": {
              "color": 62975,
              "author": {
                "name": `${user.username}`,
                "icon_url": `${user.displayAvatarURL}`
              },
              "fields": [{
                "name": "Money",
                "value": `$${shortNumber(money)}`
              },
              {
                "name": "XP",
                "value": `${shortNumber(xp)} / ${shortNumber(level*150)}`
              },
              {
                "name": "Level",
                "value": `${level}`
              }],
              "timestamp": new Date()
            }
          };
          mes.channel.send(bal);
        }
      });
    });
  }

  function makeProfile(mes, money, xp, level, tag) {
    Jimp.read(pic, function(err, image) {
      if (err) throw err;
      mes.channel.startTyping(1);
      Jimp.loadFont(fon).then(function(font) {
        image.print(font, parseInt(process.env.NAME_X), parseInt(process.env.NAME_Y), tag).getBuffer(Jimp.MIME_JPEG, function(err, img) {
          if (err) throw err;
          Jimp.loadFont(fonTwo).then(function(font) {
            image.print(font, 36, 250, `XP ${shortNumber(xp)} / ${shortNumber(level*150)}`).getBuffer(Jimp.MIME_JPEG, function(err, img) {
              if (err) throw err;
              image.print(font, 36, 330, `Level ${level}`).getBuffer(Jimp.MIME_JPEG, function(err, img) {
                if (err) throw err;
                image.print(font, 36, 410, `$${shortNumber(money)}`).getBuffer(Jimp.MIME_JPEG, function(err, img) {
                  if (err) throw err;
                  image.scale(0.35).write("/app/tempBal.jpg");
                  mes.channel.send("", {
                    files: ["/app/tempBal.jpg"]
                  });
                  mes.channel.stopTyping();
                });
              });
            });
          });
        });
      });
    });
  }

}

exports.run = (client, message, args, mongo) => {

  var UserURL = process.env.USER;

  mongo.connect(UserURL, function(err, db) {
    var dbo = db.db("users");
    var query = {
      "name": message.author.tag
    };
    dbo.collection("users").findOne(query, function(err, result) {
      var d = new Date();
      if (err) throw err;
      if (result != null) {
        if (result.daily != d.getDate() + d.getMonth()) {
          var ch = defaultUser;
          message.reply(`you just gained ${result.level * 200} as your daily pay!`);
          ch.name = result.name;
          ch.xp = result.xp;
          ch.level = result.level;
          ch.money = result.money + (result.level * 200);
          ch.daily = d.getDate() + d.getMonth();
          dbo.collection("users").update(query, ch, function(err, res) {
            if (err) throw err;
            db.close();
          });
        } else {
          message.reply("you've already gotten your daily!");
        }
      }
    });
  });
}

exports.run = (client, message, args, mongo) => {

    var ServerURL = process.env.SERVER;

    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply("sorry, you don't have permissions to use this.");

    if (args[0].length > 10) {
      message.reply("guild prefix can't be longer than 10 characters");
    } else {
      mongo.connect(ServerURL, function(err, db) {
        var dbo = db.db("servers");
        var query = {
          "serverID": message.guild.id
        };
        dbo.collection("servers").findOne(query, function(err, result) {
          if (err) throw err;
          var t = result;
          t.prefix = args[0].toString();
          dbo.collection("servers").update(query, t, function(err, res) {
            if (err) throw err;
            message.reply("guild prefix updated to `" + args[0] + "`");
          });
        });
      });
    }
}

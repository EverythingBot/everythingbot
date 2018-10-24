exports.run = (client, message, args, mongo, srvURL, clURL) => {

  var ServerURL = srvURL;

  if (message.member.hasPermission("ADMINISTRATOR")) {
    mongo.connect(ServerURL, function(err, db) {
      if (err) throw err;
      var dbo = db.db("servers");
      var query = {
        "serverID": message.guild.id
      };

      dbo.collection("servers").find(query).toArray(function(err, result) {
        if (err) throw err;
        if (args[0] == "role" || args[0] == "r") {
          r = result[0];
          r.welcomeRole = null;
          dbo.collection("servers").update(query, r, function(err, res) {
            if (err) throw err;
            message.reply("the default role has been disabled. To re-enable, run the `setup` command again");
          });
        } else if (args[0] == "welcome" || args[0] == "w") {
          r = result[0];
          r.welcomeChannel = null;
          dbo.collection("servers").update(query, r, function(err, res) {
            if (err) throw err;
            message.reply("the welcome channel has been disabled. To re-enable, run the `setup` command again");
          });
        } else if (args[0] == "logs" || args[0] == "l") {
          r = result[0];
          r.logChannel = null;
          dbo.collection("servers").update(query, r, function(err, res) {
            if (err) throw err;
            message.reply("logging has been disabled. To re-enable, run the `setup` command again");
          });
        } else {
          message.reply("Available options are `role, welcome, logs`");
        }
        db.close();
      });
    });
  } else {
    message.reply("you're not allowed to use this command!");
  }
}

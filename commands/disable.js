exports.run = (client, message, args, mongo) => {
  if (message.member.hasPermission("ADMINISTRATOR")) {
    if (args[0] === "role" || args[0] === "r") {
      mongo.connect(ServerURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("servers");
        var query = {
          "serverID": message.guild.id
        };
        dbo.collection("servers").find(query).toArray(function(err, result) {
          if (err) throw err;
          if (result[0] != null) {
            r = result[0];
            r.welcomeRole = null;
            dbo.collection("servers").update(query, r, function(err, res) {
              if (err) throw err;
              message.reply("the default role has been disabled. To re-enable, run the `setup` command again");
              db.close();
            });
          } else {
            db.close();
          }
        });
      });
    } else if (args[0] === "welcome" || args[0] === "w") {
      mongo.connect(ServerURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("servers");
        var query = {
          "serverID": message.guild.id
        };
        dbo.collection("servers").find(query).toArray(function(err, result) {
          if (err) throw err;
          if (result[0] != null) {
            r = result[0];
            r.welcomeChannel = null;
            dbo.collection("servers").update(query, r, function(err, res) {
              if (err) throw err;
              message.reply("welcome message has been disabled. To re-enable, run the `setup` command again");
              db.close();
            });
          } else {
            db.close();
          }
        });
      });
    } else {
      message.reply("Available options to disable are `welcome` and `role`");
    }
  } else {
    message.reply("you're not allowed to use this command!");
  }
}

exports.run = async function (client, message, args, mongo) {

  if (message.member.hasPermission("ADMINISTRATOR")) {
    setup(message, message.author.tag);
  } else {
    message.reply("you're not allowed to use this command!");
  }

  function setup(message, author) {
    message.reply("please reply with your welcome channel").then(message => {
      const filter = m => m.author.tag.includes(author);
      message.channel.awaitMessages(filter, {
          max: 1,
          time: 60000,
          errors: ['time']
        })
        .then(collected => {
          setupChannel(collected, message, author);
        })
        .catch(collected => {
          if (collected.size < 1)
            message.channel.send("Setup cancelled, you took longer than 1 minute!");
        });
    });
  }

  function setupChannel(collected, message, author) {
    var query = {
      "content": -1
    };
    var c = collected.first().content.toString().replace(/[<#>]/g, '');
    var x = collected.first().content;
    if (client.channels.get(c)) {
      mongo.connect(ServerURL, function(err, db) {
        var dbo = db.db("servers");
        var query = {
          "serverID": message.guild.id
        };
        dbo.collection("servers").findOne(query, function(err, result) {
          if (err) throw err;
          var r = result;
          r.welcomeChannel = c;
          dbo.collection("servers").update(query, r, function(err, res) {
            if (err) throw err;
            message.channel.send("Now send the name of the role you want people to get when they join").then(message => {
              const filter2 = m => m.author.tag.includes(author);
              message.channel.awaitMessages(filter2, {
                  max: 1,
                  time: 60000,
                  errors: ['time']
                })
                .then(c => {
                  //console.log(c.first().content);
                  var role = c.first().content.toString();
                  //console.log(message.channel.guild.roles.exists("name", role));
                  if (message.channel.guild.roles.exists("name", role)) {
                    r.welcomeRole = role;
                    var dbo = db.db("servers");
                    var query = {
                      "serverID": message.guild.id
                    };
                    dbo.collection("servers").update(query, r, function(err, result) {
                      if (err) throw err;
                      message.channel.send(`Guild default role set to ${role}`);
                      message.channel.send("Setup complete! (For now)");
                      db.close();
                    });
                  } else {
                    message.channel.send("That's not a valid role!");
                    db.close();
                  }
                })
                .catch(c => {
                  if (c.size < 1) {
                    message.channel.send("Setup cancelled, you took longer than 1 minute!");
                    db.close();
                  }
                });
            });
          });
        });
      });
      message.channel.send(`Guild welcome channel updated to ${x}`);
    } else {
      message.channel.send("That's not a channel!");
    }
  }
}

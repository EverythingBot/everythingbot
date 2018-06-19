exports.run = async function(client, message, args, mongo) {

  var ServerURL = process.env.SERVER;

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
              var done = false;

              var query = {
                "serverID": message.guild.id
              };
              var c1 = collected.first().content.toString().replace(/[<#>]/g, '');
              var x = collected.first().content;
              if (message.guild.channels.get(c1)) {
                //ser.welcomeChannel = c;
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
                      //  ser.welcomeRole = role;
                        message.channel.send('Guild default role set to `' + role + '`');
                        message.channel.send(`Guild welcome channel set to ${x}`);
                        message.channel.send("Setup complete! (For now)");
                        var ser =  { $set: {  "welcomeRole": role,  "welcomeChannel": c1  }  };
                        mongo.connect(ServerURL, function(err, db) {
                          var dbo = db.db("servers");
                          dbo.collection("servers").updateOne(query, ser, function(err, result) {
                            if (err)
                              console.log(err);
                            db.close();
                          });
                        });
                      } else {
                        message.channel.send("That's not a valid role!");
                      }
                    })
                    .catch(c => {
                      if (c.size < 1) {
                        message.channel.send("Setup cancelled, you took longer than 1 minute!");
                      }
                    });
                });
              } else {
                message.channel.send("That wasn't a channel! Are you sure you said a channel name? (Ex. `#general`)");
              }
            });
          })
      .catch(collected => {
        if (collected.size < 1)
          message.channel.send("Setup cancelled, you took longer than 1 minute!");
      });
    }
}

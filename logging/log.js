exports.run = (message, mongo, srvURL, clURL, type, oldMessage) => {

  mongo.connect(srvURL, {
    useNewUrlParser: true
  }, function(err, db) {
    var dbo = db.db("servers");

    var query = {
      "serverID": message.guild.id
    };

    dbo.collection("servers").find(query).toArray(function(err, result) {
      var serv = result[0];
      if (err)
        throw err;

      if (serv.logChannel == null)
        return;

      if (message.guild.channels.get(serv.logChannel.toString()) == null)
        return;

      if (type == "delete") {
        var l = message.guild.channels.get(serv.logChannel.toString());

        var loggedMessage = {
          "embed": {
            "color": 16711680,
            "author": {
              "name": `${message.author.username}`,
              "icon_url": `${message.author.displayAvatarURL}`
            },
            "description": `Message sent in ${message.channel.name} was deleted`,
            "fields": [{
              "name": "Message",
              "value": `${message.content}`
            }],
            "timestamp": new Date()
          }
        };

        l.send(loggedMessage);
      }

      if (type == "edit") {
        var l = message.guild.channels.get(serv.logChannel.toString());
        var loggedMessage = {
          "embed": {
            "color": 16776960,
            "author": {
              "name": `${message.author.username}`,
              "icon_url": `${message.author.displayAvatarURL}`
            },
            "description": `Message sent by ${message.author.username} in ${message.channel.name} was edited`,
            "fields": [{
                "name": "Old Message",
                "value": `${oldMessage.content}`
              },
              {
                "name": "New Message",
                "value": `${message.content}`
              }
            ],
            "timestamp": new Date()
          }
        };
        l.send(loggedMessage);
      }
      db.close();
    });
  });
}

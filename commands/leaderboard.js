exports.run = (client, message, args, mongo) => {
  var UserURL = process.env.USER;
  const Discord = require("discord.js");

  if (args[0] === "money" || args[0] === "m") {
    mongo.connect(UserURL, function(err, db) {
      if (err) message.reply("error connecting to server!");
      var dbo = db.db("users");
      var sort = {
        "money": -1
      };
      dbo.collection("users").find().sort(sort).toArray(function(err, result) {
        if (err) throw err;
        sendEmbed(message, result, true);
        db.close();
      });
    });
  } else if (args[0] === "level" || args[0] === "l") {
    mongo.connect(UserURL, function(err, db) {
      if (err) message.reply("error connecting to server!");
      var dbo = db.db("users");
      var sort = {
        "level": -1
      };
      dbo.collection("users").find().sort(sort).toArray(function(err, result) {
        if (err) throw err;
        sendEmbed(message, result, false);
        db.close();
      });
    });
  } else {
    message.reply("leaderboard categories are `money` and `level`");
  }

  function sendEmbed(m, result, money) {
    if (money == true) {
      const embed = new Discord.RichEmbed()
        .setTitle("Money Leaderboard")
        .setColor("#0aaa1c")
        .addField(`1. ${result[0].name}`, `$${result[0].money}`)
        .addField(`2. ${result[1].name}`, `$${result[1].money}`)
        .addField(`3. ${result[2].name}`, `$${result[2].money}`)
        .addField(`4. ${result[3].name}`, `$${result[3].money}`)
        .addField(`5. ${result[4].name}`, `$${result[4].money}`)
        .addField(`6. ${result[5].name}`, `$${result[5].money}`)
        .addField(`7. ${result[6].name}`, `$${result[6].money}`)
        .addField(`8. ${result[7].name}`, `$${result[7].money}`)
        .addField(`9. ${result[8].name}`, `$${result[8].money}`)
        .addField(`10. ${result[9].name}`, `$${result[9].money}`);
      m.channel.send({
        embed
      });
    } else {
      const embed = new Discord.RichEmbed()
        .setTitle("Level Leaderboard")
        .setColor("#790084")
        .addField(`1. ${result[0].name}`, `Level: ${result[0].level}`)
        .addField(`2. ${result[1].name}`, `Level: ${result[1].level}`)
        .addField(`3. ${result[2].name}`, `Level: ${result[2].level}`)
        .addField(`4. ${result[3].name}`, `Level: ${result[3].level}`)
        .addField(`5. ${result[4].name}`, `Level: ${result[4].level}`)
        .addField(`6. ${result[5].name}`, `Level: ${result[5].level}`)
        .addField(`7. ${result[6].name}`, `Level: ${result[6].level}`)
        .addField(`8. ${result[7].name}`, `Level: ${result[7].level}`)
        .addField(`9. ${result[8].name}`, `Level: ${result[8].level}`)
        .addField(`10. ${result[9].name}`, `Level: ${result[9].level}`);
      m.channel.send({
        embed
      });
    }
  }

}

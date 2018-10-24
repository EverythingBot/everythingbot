const Discord = require("discord.js");
const Attachment = require("discord.js").Attachment;
var Jimp = require("jimp");
var ms = require("ms");
var mongo = require("mongodb").MongoClient;
//var welcomerole = false;
var fs = require('fs');
//MongoDB URL
var UserURL = process.env.USER;
var ServerURL = process.env.SERVER;
//Discord.js Client
const client = new Discord.Client();

var prefix = 'e!';

//var pic = "https://github.com/Ironfacebuster/everythingbot/blob/master/balPic.png?raw=true";
var pic = "/app/balPic.png"
var fon = ".fonts/bahnschrift.fnt";
var fonTwo = ".fonts/FranklinGothicMedium.fnt";

var defaultServer = {
  "serverID": null,
  "prefix": 'e!',
  "welcomeRole": null,
  "welcomeChannel": null
}

var defaultUser = {
  "name": null,
  "money": 0,
  "xp": 0,
  "level": 1,
  "daily": null
}

function isAdmin(member) {
  return member.hasPermission("ADMINISTRATOR");
}

function isKick(member) {
  return member.hasPermission("KICK_MEMBERS");
}

function isBan(member) {
  return member.hasPermission("BAN_MEMBERS");
}

var helpMenu = {
  embed: {
    color: 3447003,
    description: "EverythingBot, does literally everything (Still in production, currently doesn't do much). Here's the list of commands",
    fields: [{
        name: ":straight_ruler:  Admin/Mod",
        value: "clear, kick, ban, unban, mute, unmute, setprefix, setup, disable, lockdown"
      },
      {
        name: ":camera:  Image commands",
        value: "poster, sepia, greyscale, invert, flip, mirror, blur, rotate"
      },
      {
        name: ":laughing: Fun commands",
        value: "meme, pickup, roast, mock, kill"
      },
      {
        name: ":briefcase: User commands",
        value: "bal, daily, leaderboard"
      },
      {
        name: ":regional_indicator_t: :regional_indicator_e: :regional_indicator_x: :regional_indicator_t:  commands",
        value: "ping, bigtext, invite, server"
      },
      {
        name: ":thinking: Etc commands",
        value: "credits, membercount"
      }
    ],
    footer: {
      text: `This guild's prefix is: ${prefix}`
    }
  }
};

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`on ${client.guilds.size} servers | e!help`);
});

client.on("guildCreate", guild => {
  console.log('Name: ' + guild.name + (' id: ' + guild.id) + ' Members: ' + guild.memberCount);
  let defaultChannel = "";
  guild.channels.forEach((channel) => {
    if (channel.type == "text" && defaultChannel == "") {
      if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  });
  defaultChannel.send("Thanks for inviting me to the server! I'm **EverythingBot**. If you need any help, type `e!help`. \r\nIf you have any questions, join the support server https://discord.gg/yuSHrjr");
  mongo.connect(ServerURL, {
    useNewUrlParser: true
  }, function(err, db) {

    if (err) console.error('Error occurred', err);

    var dbo = db.db("servers");
    var serv = defaultServer;
    serv.serverID = guild.id;
    try {
      dbo.collection("servers").insertOne(serv);
      db.close();
    } catch (err) {
      console.log(err);
    }
  });
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`on ${client.guilds.size} servers | e!help`);
});

client.on("guildMemberAdd", guild => {
  mongo.connect(ServerURL, {
    useNewUrlParser: true
  }, function(err, db) {
    if (err) console.error('Error occurred', err);
    var dbo = db.db("servers");
    var query = {
      "serverID": guild.guild.id
    };
    dbo.collection("servers").find(query).toArray(function(err, result) {
      if (err) console.error('Error occurred', err);
      if (result[0].welcomeChannel !== null) {
        guild.guild.channels.get(result[0].welcomeChannel).send(`Welcome to __**${guild.guild.name}**__, <@${guild.user.id}>!`);
      }
      if (result[0].locked != null && result[0].locked == true) {
        let muteRole = guild.guild.roles.find(x => x.name === "eBot Mute");
        guild.addRole(muteRole.id);
      }
      if (result[0].welcomeRole !== null) {
        let r = guild.guild.roles.find(x => x.name === result[0].welcomeRole);
        guild.addRole(r)
          .catch(console.error);
      }
      db.close();
    });
  });
});

client.on("guildMemberRemove", guild => {
  mongo.connect(ServerURL, {
    useNewUrlParser: true
  }, function(err, db) {
    if (err) console.error('Error occurred', err);
    var dbo = db.db("servers");
    var query = {
      "serverID": guild.guild.id
    };
    dbo.collection("servers").find(query).toArray(function(err, result) {
      if (err) console.error('Error occurred', err);
      if (result[0].welcomeChannel !== null) {
        guild.guild.channels.get(result[0].welcomeChannel).send(`**${guild.user.tag}** just left. See you later!`);
        db.close();
      } else {
        db.close();
      }
    });
  });
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`on ${client.guilds.size} servers | e!help`);
});

client.on("message", async message => {
  if (message.guild === null)
    return;

  //Creating a muted role, for muting... Also going through every text channel and making sure eBot Mute can't talk!
  if (!message.guild.roles.find(x => x.name === "eBot Mute")) {
    message.member.guild.createRole({
        name: 'eBot Mute',
        color: 1,
        hoist: false,
        mentionable: false,
        permissions: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL"]
      },
      'Required for EverythingBot muting');
    addPermission(message);
  } else
    addPermission(message);

  mongo.connect(ServerURL, {
    useNewUrlParser: true
  }, function(err, db) {

    if (err) console.error('Error occurred', err);

    var dbo = db.db("servers");
    var query = {
      "serverID": message.guild.id
    };
    if (message.guild !== null) {
      dbo.collection("servers").find(query).toArray(function(err, result) {
        if (err) console.error('Error occurred', err);
        if (result[0] != null) {
          prefix = result[0].prefix;
          checkCommand(message, prefix);
          db.close();
        } else {
          var serv = defaultServer;
          serv.serverID = message.guild.id;
          try {
            dbo.collection("servers").insertOne(serv);
            db.close();
          } catch (err) {
            console.log(err);
          }
        }
      });
    }
  });

  if (message.mentions.members.first()) {
    if (message.mentions.members.first().user.id === client.user.id) mentionCommand(message, message.mentions.members.first());
  }
});

function addPermission(message) {
  let ebot = message.guild.roles.find(x => x.name === "eBot Mute");
  var chann = message.guild.channels.array();
  for (var i = 0; i < chann.length; i++) {
    if (chann[i].type == "text") {
      //Check if that channel allows eBot Mute to talk, if it can, DISABLE IT!
      if (!chann[i].permissionsFor(ebot.id))
        chann[i].overwritePermissions(
          ebot.id, {
            SEND_MESSAGES: false
          },
          'Required for EverythingBot muting'
        );
    }
  }
}

client.on("message", async message => {
  if (message.author.bot)
    return;

  mongo.connect(UserURL, {
    useNewUrlParser: true
  }, function(err, db) {
    if (err) console.error('Error occurred', err);

    var dbo = db.db("users");
    var query = {
      "name": message.author.id
    };
    dbo.collection("users").findOne(query, function(err, result) {
      if (err) console.error('Error occurred', err);
      if (result !== null) {
        var upd = result;
        upd.xp = result.xp + 1;
        dbo.collection("users").update(query, upd, function(err, res) {
          if (err) console.error('Error occurred', err);
          db.close();
        });
      } else {
        db.close();
      }
    });
  });

  mongo.connect(UserURL, {
    useNewUrlParser: true
  }, function(err, db) {

    if (err) console.error('Error occurred', err);

    var dbo = db.db("users");
    var query = {
      "name": message.author.id
    };
    dbo.collection("users").findOne(query, function(err, result) {
      if (err) console.error('Error occurred', err);
      if (result != null) {
        var upd = result;
        if (result.xp > Math.floor(result.level * 150)) {
          message.reply(`you've leveled up! Your new level is ${upd.level + 1}.`);
          upd.xp = result.xp - result.level * 150;
          upd.level += 1;
          dbo.collection("users").update(query, upd, function(err, res) {
            if (err) console.error('Error occurred', err);
            db.close();
          });
        } else {
          db.close();
        }
      } else {
        if (message.author.bot === false) {
          dbo.collection("users").findOne(query, function(err, result) {
            if (err) console.error('Error occurred', err);
            if (result == null) {
              var user = defaultUser;
              user.name = message.author.id;
              try {
                dbo.collection("users").insertOne(user);
                db.close();
              } catch (err) {
                console.log(err);
              }
            }
            db.close();
          });
        } else
          db.close();
      }
    });
  });
});

async function mentionCommand(message, p) {
  const args = message.content.slice(p.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (args[0] === "help") {
    message.channel.send(helpMenu);
  }
}

async function checkCommand(message, prefix) {

  if (message.author.bot) return;

  if (message.content.indexOf(prefix) !== 0) return;

  try {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let file = require(`./commands/${command}.js`);
    file.run(client, message, args, mongo, ServerURL, UserURL);
  } catch (err) {
    console.log(err);
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  var col = null;

  if (command === "server") {
    message.channel.send(`https://discord.gg/yuSHrjr`);
  }

  if (command === "credits") {
    message.reply({
      embed: {
        color: 3447003,
        description: "Welcome to the credits!",
        fields: [{
            name: "Thanks to Popestar#0545",
            value: "For most of the insults."
          },
          {
            name: "Thanks to PackersRuleGoPack#2232",
            value: "Source code, and permission to revive the bot."
          },
          {
            name: "Yer Good Ol' Loli Grandpappy#8486",
            value: "Revived the bot!"
          }
        ],
        footer: {
          text: "EverythingBot"
        }
      }
    });
  }
  /*
  if (command === "gayray") {
  message.channel.send();
  const filter = response => ((response.author.id != "440524747353227275"));
  message.channel.send(`Person below triple hella quadruple gay
  AND, if they delete their message they are permanently gay, and will be reminded of that.
  AND, this message can't be deflected.
  AND, all cards and comebacks are null against this, and it gives you Autism Vaccines®
  AND, no amount of emojis can block the GayRay®
  |
  |
  V`).then(() => {
  message.channel.awaitMessages(filter, {
  maxMatches: 1,
  time: 30000,
  errors: ['time']
  })
  .then(collected => {
  console.log(collected.first().author);
  message.channel.send(`${collected.first().author} has the gay!`)
  collected.first().member.setNickname('Hella Gay Man')
  .then(console.log())
  .catch(console.error);
  })
  .catch(collected => {
  message.channel.send('Looks like no-one is gay. Bye you str8 people.');
  });
  });
  }
  */

  if (command === "invite") {
    message.channel.send(`You can invite me with this link: https://discordapp.com/api/oauth2/authorize?client_id=440524747353227275&permissions=8&scope=bot`);
  }
}

client.on("messageDelete", async message => {
  if (message.guild == null || message.author.bot)
    return;
  try {
    let file = require(`./logging/log.js`);
    file.run(message, mongo, ServerURL, UserURL, "delete");
  } catch (err) {
    console.log(err);
  }
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (newMsg.guild == null || newMsg.author.bot)
    return;
  try {
    let file = require(`./logging/log.js`);
    file.run(newMsg, mongo, ServerURL, UserURL, "edit", oldMsg);
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.BOT_TOKEN);

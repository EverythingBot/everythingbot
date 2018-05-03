
const Discord = require("discord.js");
const Attachment = require("discord.js").Attachment;
var Jimp = require("jimp");
var ms = require("ms");
var mongo = require("mongodb").MongoClient;
//var welcomerole = false;

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

var helpMenu = {
	embed: {
      color: 3447003,
      description: "EverythingBot, does literally everything (Still in production, currently doesn't do much). Here's the list of commands",
      fields: [{
          name: ":straight_ruler:  Admin/Mod",
          value: "clear, kick, ban, unban, mute, unmute, setprefix, setup, disable"
        },
		{
          name: ":camera:  Image commands",
          value: "poster, sepia, greyscale, invert, flip, mirror, blur, rotate"
        },
        {
          name: ":laughing: Fun commands",
          value: "meme, pickup, insult, mock, kill, gayray"
        },
		{
          name: ":briefcase: User commands",
          value: "bal, daily, leaderboard/l"
        },
        {
          name: ":regional_indicator_t: :regional_indicator_e: :regional_indicator_x: :regional_indicator_t:  commands",
          value: "ping, bigtext, mention, announce, invite, server"
        },
		{
          name: ":thinking: Etc commands",
          value: "credits, membercount/mc"
        }
      ],
      footer: {
        text: `This guild's prefix is: ${prefix}`
      }
	}
}

var defaultServer = {
	"serverID":null,
	"prefix":'e!',
	"welcomeRole":null,
	"welcomeChannel":null
}

var defaultUser = {
	name:null,
	"money":0,
	"xp":0,
	"level":1,
	"daily":null
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

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  client.user.setActivity(`on ${client.guilds.size} servers | e!help`);
});

client.on("guildCreate", guild => {
  console.log('Name: ' + guild.name + (' id: ' + guild.id) + ' Members: ' + guild.memberCount);
  let defaultChannel = "";
  guild.channels.forEach((channel) => {
	if(channel.type == "text" && defaultChannel == "") {
		if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
			defaultChannel = channel;
		}
	}
  });
  defaultChannel.send("Thanks for inviting me to the server! I'm **EverythingBot**. If you need any help, type `e!help`. \r\nIf you have any questions, join the support server https://discord.gg/yuSHrjr");
  mongo.connect(ServerURL, function(err, db) {
	  var dbo = db.db("servers");
	  var serv = defaultServer;
	  serv.serverID = guild.id;
	  dbo.collection("servers").insert(serv, function(err, obj) {
		  if(err) throw err;
		  db.close();
	  });
  });
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`on ${client.guilds.size} servers | e!help`);
});

client.on("guildMemberAdd", guild => {
	mongo.connect(ServerURL, function(err, db) {
		if(err) throw err;
		var dbo = db.db("servers");
		var query = { "serverID": guild.guild.id };
		dbo.collection("servers").find(query).toArray(function(err, result) {
			if(err) throw err;
			if(result[0].welcomeChannel!==null){
				guild.guild.channels.get(result[0].welcomeChannel).send(`Welcome to __**${guild.guild.name}**__, <@${guild.user.id}>!`);
			}
			if(result[0].welcomeRole!==null){
				let r = guild.guild.roles.find("name",result[0].welcomeRole);
				guild.addRole(r)
					.catch(console.error);
			}
			db.close();
		});
	});
});

client.on("guildMemberRemove", guild => {
	mongo.connect(ServerURL, function(err, db) {
		if(err) throw err;
		var dbo = db.db("servers");
		var query = { "serverID": guild.guild.id };
		dbo.collection("servers").find(query).toArray(function(err, result) {
			if(err) throw err;
			if(result[0].welcomeChannel!==null){
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
	if(message.guild !== null) {
		mongo.connect(ServerURL, function(err, db) {
			var dbo = db.db("servers");
			var query = { "serverID": message.guild.id };
			if(message.guild !== null) {
				dbo.collection("servers").find(query).toArray (function (err, result) {
					if(err) throw err;
					if(result[0] != null){
						prefix = result[0].prefix;
						checkCommand(message,prefix);
						db.close();
					} else {
						var serv = defaultServer;
						serv.serverID = message.guild.id;
						dbo.collection("servers").insert(serv, function(err, obj) {
							if(err) throw err;
							db.close();
						});
					}
				});
			}
		});
		
		if(message.mentions.members.first()){
			if(message.mentions.members.first().user.id===client.user.id) mentionCommand (message, message.mentions.members.first());
		}
	}
});

client.on("message", async message => {
	var ran = Math.floor(Math.random()*100);
	if(ran > 75){
		mongo.connect(UserURL, function(err, db) {
			var dbo = db.db("users");
			var query = { "name": message.author.tag };
			dbo.collection("users").findOne(query, function (err, result) {
				if(err) throw err;
				if(result !== null){
					var upd = result;
					upd.xp = result.xp + Math.floor(Math.random()*5)+1;
					dbo.collection("users").update(query, upd, function (err, res){
						if(err) throw err;
						db.close();
					});
				} else {
					db.close();
				}
			});
		});
	}
	
	mongo.connect(UserURL, function(err, db) {
		var dbo = db.db("users");
		var query = { "name": message.author.tag };
		dbo.collection("users").findOne(query, function (err, result) {
			if(err) throw err;
			if(result !== null){
				var upd = result;
				if(result.xp > Math.floor(result.level * 150)){
					message.reply(`you've leveled up! Your new level is ${upd.level + 1}.`);
					upd.xp = result.xp - result.level * 150;
					upd.level += 1;
					dbo.collection("users").update(query, upd, function (err, res){
						if(err) throw err;
						db.close();
					});
				} else {
					db.close();
				}
			} else {
				var user = defaultUser;
				user.name = message.author.tag;
				if(message.author.bot===false){
					dbo.collection("users").findOne(query, function (err, result) {
						if(err) throw err;
						if(result == null){
							dbo.collection("users").insertOne(user, function(err, obj){
								if(err) throw err;
								db.close();
							});
						} else {
							db.close();
						}
					});
				} else {
					db.close();
				}
			}
		});
		
	});
});

async function mentionCommand (message, p){
	const args = message.content.slice(p.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	if(args[0] === "help"){
		message.channel.send(helpMenu);
	}
}

async function checkCommand (message, prefix) {
	
	if(message.author.bot) return;
	
	if(message.content.indexOf(prefix) !== 0) return;
	
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	var col = null;
	
	if(command === "setup") {
		if(message.member.hasPermission("ADMINISTRATOR")){
			setup (message, message.author.tag);
		} else {
			message.reply("you're not allowed to use this command!"); 
		}
	}
	
	if(command === "disable" || command === "d") {
		if(message.member.hasPermission("ADMINISTRATOR")){
		if(args[0] === "role" || args[0] === "r") {
			mongo.connect(ServerURL, function(err, db) {
				if(err) throw err;
				var dbo = db.db("servers");
				var query = { "serverID": message.guild.id };
				dbo.collection("servers").find(query).toArray (function (err, result) {
					if(err) throw err;
					if(result[0] != null){
						r = result[0];
						r.welcomeRole = null;
						dbo.collection("servers").update(query, r, function (err, res) {
							if(err) throw err;
							message.reply("the default role has been disabled. To re-enable, run the `setup` command again");
							db.close();
						});
					} else {
						db.close();
					}
				});
			});
		} else if(args[0] === "welcome" || args[0] === "w") {
			mongo.connect(ServerURL, function(err, db) {
				if(err) throw err;
				var dbo = db.db("servers");
				var query = { "serverID": message.guild.id };
				dbo.collection("servers").find(query).toArray (function (err, result) {
					if(err) throw err;
					if(result[0] != null){
						r = result[0];
						r.welcomeChannel = null;
						dbo.collection("servers").update(query, r, function (err, res) {
							if(err) throw err;
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
	
	if(command === "leaderboard" || command === "l"){
		if(args[0] === "money"||args[0] === "m") {
			mongo.connect(UserURL, function(err, db) {
				if(err) message.reply("error connecting to server!");
				var dbo = db.db("users");
				dbo.collection("users").find().sort(sort).toArray(function(err, result) {
					if(err) throw err;
					sendEmbed(message, result, true);
					db.close();
				});
			});
		} else if (args[0] === "level"||args[0] === "l") {
			mongo.connect(UserURL, function(err, db) {
				if(err) message.reply("error connecting to server!");
				var dbo = db.db("users");
				var sort = { "level": -1 };
				dbo.collection("users").find().sort(sort).toArray(function(err, result) {
					if(err) throw err;
					sendEmbed(message, result, false);
					db.close();
				});
			});
		} else {
			message.reply("leaderboard categories are `money` and `level`");
		}
	}
	
	if(command === "daily") {
		mongo.connect(UserURL, function(err, db) {
			var dbo = db.db("users");
			var query = { "name": message.author.tag };
			dbo.collection("users").findOne(query, function (err, result) {
				var d = new Date();
				if(err) throw err;
				if(result != null){
					if(result.daily != d.getDate()+d.getMonth()){
						var ch = defaultUser;
						message.reply(`you just gained ${result.level * 200} as your daily pay!`).then(message => {
							message.delete(3000);
						});
						ch.name = result.name;
						ch.xp = result.xp;
						ch.level = result.level;
						ch.money = result.money + (result.level * 200);
						ch.daily = d.getDate()+d.getMonth();
						dbo.collection("users").update(query, ch, function (err, res) {
							if(err) throw err;
							db.close();
						});
					} else {
						message.reply("you've already gotten your daily!");
					}
				}
			});
		});
	}
	
	if(command === "sepia") {
		if(message.mentions.members.first()) {
			sepiaFunction(message, message.mentions.members.first().user.avatarURL);
		} else if(args[0] == null) {
			sepiaFunction(message, message.author.avatarURL); 
		} else sepiaFunction(message, args[0]);	
	}
	
	if(command === "poster") {
		if(message.mentions.members.first()) {
			posterFunction(message, args[0], message.mentions.members.first().user.avatarURL);
		} else if(args[1] == null && args[0] != null) {
			posterFunction(message, args[0], message.author.avatarURL); 
		}  else if(args[0] != null) {
			posterFunction(message, args[0], args[1]);	
		} else {
			message.reply(`you've done something wrong! Are you sure you did ${prefix}poster [amount] [link/user]?`);
		}

	}
	
	if(command === "mirror") {
		if(message.mentions.members.first()) {
			mirrorFunction(message, message.mentions.members.first().user.avatarURL);
		} else if(args[0] == null) {
			mirrorFunction(message, message.author.avatarURL); 
		} else mirrorFunction(message, args[0]);	
	}
	
	if(command === "flip") {
		if(message.mentions.members.first()) {
			flipFunction(message, message.mentions.members.first().user.avatarURL);
		} else if(args[0] == null) {
			flipFunction(message, message.author.avatarURL); 
		} else flipFunction(message, args[0]);	
	}
	
	if(command === "invert") {
		if(message.mentions.members.first()) {
			invertFunction(message, message.mentions.members.first().user.avatarURL);
		} else if(args[0] == null) {
			invertFunction(message, message.author.avatarURL); 
		} else invertFunction(message, args[0]);	
	}
	
	if(command === "greyscale") {
		if(message.mentions.members.first()) {
			greyscaleFunction(message, message.mentions.members.first().user.avatarURL);
		} else if(args[0] == null) {
			greyscaleFunction(message, message.author.avatarURL); 
		} else greyscaleFunction(message, args[0]);	
	}
	
	if(command === "blur") {
		if(message.mentions.members.first()) {
			blurFunction(message, args[0], message.mentions.members.first().user.avatarURL);
		} else if(args[1] == null && args[0] != null) {
			blurFunction(message, args[0], message.author.avatarURL); 
		} else if(args[0] != null) {
			blurFunction(message, args[0], args[1]);	
		} else {
			message.reply(`you've done something wrong! Are you sure you did ${prefix}blur [amount] [link/user]?`);
		}
	}
	
	if(command === "rotate") {
		if(message.mentions.members.first()) {
			rotateFunction(message, args[0], message.mentions.members.first().user.avatarURL);
		} else if(args[1] == null && args[0] != null) {
			rotateFunction(message, args[0], message.author.avatarURL); 
		} else if(args[0] != null) {
			rotateFunction(message, args[0], args[1]);
		} else {
			message.reply(`you've done something wrong! Are you sure you did ${prefix}rotate [degrees] [link/user]?`);
		}
	}
	
	if(command === "membercount" || command === "mc"){
		message.channel.send({
			"embed": {
				"color": 65299,
				"fields": [
				{
					"name":"Total members",
					"value":`${message.guild.memberCount}`,
					"inline":true
				}
				]
			}
		});
	}
	
	//This isn't even used anymore, but I'll keep it since it's not public
	/*
	if (command === "welcomerole") {
    const sayMessage = args.join(" ");
    console.log(sayMessage);
    try {
      message.channel.guild.roles.exists("name", sayMessage);
      welcomerole = sayMessage;
      console.log(welcomerole);
    }
    catch (e) {
      message.channel.send(`Sorry, that's not a valid role.` + e);
      welcomerole = false;
    }
  }
  */

	if(command === "ping") {
    const m = await message.channel.send("Ping?");
	m.edit({embed: {
      color: 3447003,
      description: "Pong!",
      fields: [
		{
          name: "Ping",
          value: `${m.createdTimestamp - message.createdTimestamp}ms`
        },
		{
          name: "API Ping",
          value: `${Math.round(client.ping)}ms`
        }
		]
	}});
   // m.edit(`Pong! Ping is ${m.createdTimestamp - message.createdTimestamp}ms. API ping is ${Math.round(client.ping)}ms`);
  }
/*
	if(command === "say") {
    const sayMessage = args.join(" ");
	if(sayMessage.includes('@everyone')||sayMessage.includes('@here')){
		message.reply(' your message _**cannot**_ include `@everyone` or `@here`').then(message => {
			message.delete(5000).catch(console.error);
		});
		return;
	}
	if(sayMessage == ""){
		message.reply(" you can't send an empty message!").then(message => {
			message.delete(5000).catch(console.error);
		});
		return;
	}
    message.delete().catch(O_o=>{});
    message.channel.send(sayMessage);
  }
  */
  
	if (command === "clear") {
        const number = args.join(" ");
        async function purge() {
            message.delete();
            if (!message.member.hasPermission("MANAGE_MESSAGES")) {
                message.channel.send('You need the \`Manage Messages\` permission to use this command.');
                return;
            }

            if (isNaN(number)) {
                message.channel.send('Please use a number as your arguments. \n Usage: ' + prefix + 'purge <amount>');
                return;
            }

            const fetched = await message.channel.fetchMessages({limit: number});

            message.channel.bulkDelete(fetched)
                .catch(error => message.channel.send(`Error: ${error}`));

        }
        try {
          purge();
        }
        catch (e) {
          console.log(e);
        }
  }

	if(command === "server"){
    message.channel.send(`https://discord.gg/yuSHrjr`);
  }

	if(command === "bigtext") {
		if(args[0] == null){
			message.reply("I can't make **nothing** into :regional_indicator_b: :regional_indicator_i: :regional_indicator_g: text!").then(message => {
				message.delete(5000).catch(console.error);
			});
			return;
		}
    var contains = function(needle) {
        var findNaN = needle !== needle;
        var indexOf;

        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;

                for(i = 0; i < this.length; i++) {
                    var item = this[i];

                    if((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }

                return index;
            };
        }

        return indexOf.call(this, needle) > -1;
    };
    const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const sayMessage = args.join(" ");
    let messageSend = "";
    for (let i = 0; i < sayMessage.length; i++) {
      if (sayMessage.charAt(i) !== " ") {
        if (contains.call(list, (sayMessage.charAt(i).toLowerCase()))){
          messageSend = messageSend + " :regional_indicator_" + sayMessage.charAt(i).toLowerCase() + ":";
        }
      }
      else {
        messageSend = messageSend + "    ";
      }
    }
    message.channel.send(messageSend);
  }

	if(command === "mention") {
    const sayMessage = args.join(" ");
	if(sayMessage.includes('@everyone')||sayMessage.includes('@here')){
		message.reply(' your message _**cannot**_ include `@everyone` or `@here`').then(message => {
		message.delete(5000).catch(console.error);
		});
		return;
	}
    try {
      message.channel.send(client.users.find('username', sayMessage).toString());
    }
    catch(e) {
      message.channel.send("Sorry, that is not a valid username! Check to make sure you didn't make any spelling mistakes.");
    }
  }

	if(command === "announce") {
    const sayMessage = args.join(" ");

      if(!message.member.hasPermission("KICK_MEMBERS")) {
          return message.reply("sorry, you don't have permissions to use this.");
      }
      else {
		if(sayMessage.includes('@everyone')||sayMessage.includes('@here')){	
			message.reply(' your message _**cannot**_ include `@everyone` or `@here`').then(message => {
			message.delete(5000).catch(console.error);
			});
			return;
		}
		message.channel.send(sayMessage);
      }
  }

	if(command === "credits") {
	 message.reply({embed: {
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
      timestamp: new Date(),
      footer: {
        text: "EverythingBot"
      }
	 }
	 });
  }

	if(command === "kick") {
    if(!message.member.hasPermission("KICK_MEMBERS")) {
        return message.reply("sorry, you don't have permissions to use this.");
    }

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("this user doesn't exist.");
    if(!member.kickable)
      return message.reply("user wasn't kicked. Make sure that I have `kick members` permissions, and that the user is kick-able.");
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick.");
    try {
      message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    }
    catch (e) {
      console.log(e);
    }
    try {
      message.mentions.members.first().user.send("You have been kicked from "+ message.channel.guild.name + ". You can still join back with an invite link!");
    }
    catch (e) {
      console.log(e);
    }
    await member.kick(reason)
      .catch(error => message.reply(`sorry ${message.author} I couldn't kick because of : ${error}`));
  }

	if(command === "ban") {
    if(!message.member.hasPermission("BAN_MEMBERS")) {
        return message.reply("sorry, you don't have permissions to use this.");
    }

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("This user does not exist.");
    if(!member.bannable)
      return message.reply("This user wasn't banned. Make sure that I have ban members permissions, and that the user is ban-able.");
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban.");
    try {
      message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
    }
    catch (e) {
      console.log(e);
    }
    try {
      message.mentions.members.first().user.send("You've been banned from "+ message.channel.guild.name + ". You can't join unless you are unbanned.");
    }
    catch (e) {
      console.log(e);
    }
    await member.ban(reason)
      .catch(error => message.reply(`sorry, ${message.author}, I couldn't ban because of : ${error}`));
  }

	if(command === "unban") {
    if(!message.member.hasPermission("BAN_MEMBERS")) {
        return message.reply("sorry, you don't have permissions to use this.");
    }

    const sayMessage = args.join(" ");
    let bansd;
    message.guild.fetchBans()
      .then(bans => {
        console.log(bans);
        let id = bans.find(function(element) {
          console.log(element.username + " is " + (element.username==sayMessage));
          return element.username == sayMessage;
        });
        if (id == null) {
          message.reply(`User isn't banned.`);
        }
        else {
          console.log(id);
          message.guild.unban(id)
            .then(user => message.reply(`Unbanned ${user.username} from ${message.guild}`))
            .catch(console.error);
          }

        })
        .catch(console.error);
  }

	if (command === "mute") {
      const sayMessage = args.join(" ");
      if(!message.member.hasPermission("KICK_MEMBERS")) {
          return message.reply("sorry, you don't have permissions to use this.");
      }

      let member = message.mentions.members.first();
      if (!member) return message.reply("That isn't a user.");
      let muteRole = message.guild.roles.find("name", "Muted");
      if(!muteRole) return message.reply("You haven't configured the `Muted` role yet. Please go to roles, and add `Muted` as a role. In `Muted`'s permissions, disable send messages.");
      let params = message.content.split(" ").slice(1);
      let time = params[1];
      if (!time) return message.reply(`there is no time specified. Please use this command in the form of ${config.prefix}`)

      member.addRole(muteRole.id);
      message.channel.send(`You've been muted for ${ms(ms(time), {long:true})} ${member.user.tag}`);

      setTimeout(function(){
        member.removeRole(muteRole.id);
        message.channel.send(`${member.user.tag} has been unmuted.`);
      }, ms(time));
  }

	if (command === "gayray") {
    message.channel.send();
   const filter = response => ((response.author.id != "438881380500373504"));

  message.channel.send(`Person below triple hella quadruple gay
AND, if they delete their message they are permanently gay, and will be reminded of that.
AND, this message can't be deflected.
AND, all cards and comebacks are null against this, and it gives you Autism Vaccines®
AND, no amount of emojis can block the GayRay®
 |
 |
V`).then(() => {
      message.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ['time'] })
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

	if (command === "unmute") {
      const sayMessage = args.join(" ");
      if(!message.member.hasPermission("KICK_MEMBERS")) {
          return message.reply("sorry, you don't have permissions to use this.");
      }

      let member = message.mentions.members.first();
      if (!member) return message.reply("That isn't a user.");
      let muteRole = message.guild.roles.find("name", "Muted");
      if(!muteRole) return msg.reply("You haven't configured the `Muted` role yet. Please go to roles, and add `Muted` as a role. In `Muted`'s permissions, disable send messages.");

      member.removeRole(muteRole.id);
      message.channel.send(`${member.user.tag} has been unmuted.`);
  }

	if (command === "meme" || command === "memes") {
    var highest = 21;
    var url = "https://www.sheshank.com/memes/" + Math.floor((Math.random() * highest) + 1) + ".jpg";
    const embed = new Discord.RichEmbed()
    .setImage(url);
     message.channel.send({embed});
  }

	if (command === "mock") {
    const sayMessage = args.join(" ");
    let a = "";
    for (var i = 0; i < sayMessage.length; i++) {
      if (i%2 == 0) {
        a = a + sayMessage.charAt(i).toLowerCase();
      }
      else {
        a = a + sayMessage.charAt(i).toUpperCase();
      }
    }
     message.channel.send(a);
  }

	if (command === "invite") {
   message.channel.send(`You can invite me with this link: https://discordapp.com/api/oauth2/authorize?client_id=440524747353227275&permissions=8&scope=bot`);
  }

	if (command === "kill" || command === "die") {
    var listOfRoasts = [
      "You died of dysentery",
      "no u",
      "no u",
      "no u"
    ];
    let member = message.mentions.members.first();
    if (!member) return message.reply("I can't kill someone that isn't a person, **smh.**");
    let rand = Math.floor((Math.random() * (listOfRoasts.length-1)) + 1);
    if (listOfRoasts[rand] == "no u") {
      message.channel.send(listOfRoasts[rand]);
    }
    else {
      message.channel.send(member.toString() + " " + listOfRoasts[rand]);
    }
  }

	if (command === "roast" || command === "insult") {
    var listOfRoasts = [
      "shut up, you'll never be the man your mother is.",
      "you're a failed abortion whose birth certificate is an apology from the condom factory.",
      "you must have been born on a highway, because that's where most accidents happen.",
      "your family tree is a cactus, because everybody on it is a prick.",
      "you're so ugly Hello Kitty said goodbye to you.",
      "you are so ugly that when your mama dropped you off at school she got a fine for littering.",
      "it looks like your face caught on fire and someone tried to put it out with a fork.",
      "do you have to leave so soon? I was just about to poison the tea.",
      "your so ugly when you popped out the doctor said aww what a treasure and your mom said yeah lets bury it",
      "we all sprang from apes, but you didn't spring far enough.",
      ", you are the equivalent of a gential piercing",
      "when I think of you, I think of world hunger, children dying, and paralyzed soldiers",
      "tried to donate his hair to children with cancer. They said \“don’t we got enough problems now you want us to look like fags\”",
      "you remind me of a middle aged man who just got a divorce. You sit in your room playing on your computer noodling around with these bots when all you’re doing is reminding yourself of how much a complete and utter failure you are.",
      "why are you hanging out with teenagers? Shouldn’t you be at the nursing home playing shuffleboard with your 80 year old girlfriend?",
      "your life is like a steak at a vegan resteraunt. It doesn’t cross the place",
      "what’s the difference between you and a brain tumor? You can get a brain tumor removed.",
      "is so ugly her face was shut down by the health department.",
      "is so ugly that when she met the Kardashians they thought she was a fourth grader with cancer.",
      "is so poor she waves around a popsicle and calls it air conditioning.",
      "you're an example of why animals eat their young.",
      "I would shoot you, but that would be disrespectful to the bullet",
      "you’re so fat that when you step on a scale it says: \“I need your weight not your phone number\”"
    ];
    let member = message.mentions.members.first();
    if (!member) return message.reply("I can't roast someone that isn't a person smh.");
    let rand = Math.floor((Math.random() * (listOfRoasts.length-1)) + 1);
    if (listOfRoasts[rand] == "no u") {
      message.channel.send(listOfRoasts[rand]);
    }
    else {
      message.channel.send(member.toString() + " " + listOfRoasts[rand]);
    }
  }

	if (command === "pickup") {
    var listOfRoasts = [
      "8 Planets, 1 Universe, 1.735 billion people, and I end up with you",
      "I’m going to have to ask you to leave. You’re making the other girls look bad.",
      ", do you have 11 protons? Because you’re sodium fine!",
      ", you know what’s on the menu? ME-N-U.",
      "are you an omelette? Because you’re making me **egg**cited.",
      "are you a bank loan? Because you've got my interest.",
      "are you the square root of -1, because you can’t be real.",
      "are you from mexico, because I think you’re the Juan for me!",
      "are you a sea lion? Because I want to sea u lion in my bed later!",
      ", is your face McDonald's? 'Cause I'm lovin it!",
      "you like maths? 'Cause I want to **ADD** to you my life, **SUBTRACT** your clothes, **DIVIDE** your legs and **MULTIPLY** ourselves.",
      "are you Harambe's enclosure? Cause I’ll drop a kid inside of you!",
      "is your name Daniel? Cause DAMN!",
      "is your dad retarded? Because you’re special",
      "if Internet Explorer is brave enough to ask you to be your default browser, I’m brave enough to ask you out!"
    ];
    let member = message.mentions.members.first();
    if (!member) return message.reply("I can't pick up no-one?");
    let rand = Math.floor((Math.random() * (listOfRoasts.length-1)) + 1);
    message.channel.send(member.toString() + " " + listOfRoasts[rand]);
  }

	if(command === "bal") {
	  mongo.connect(UserURL, function(err, db) {
		if(err) throw err;
		var dbo = db.db("users");
		var qeury = {};
		var ID;
		if(args[0] == null){
			ID = message.author.id;
			tags = message.author.tag;
			query = { name: message.author.tag };
		} else {
			if(args[0].toString().includes('@')){
				if(args[0]!='@here'&&args[0]!='@everyone'&&args[0]!='@someone'){
					ID = args[0].replace(/[<@!>]/g, '');
					if(client.users.get(ID)){
						tags = message.guild.member(ID).user.tag;
						query = { name: message.guild.member(ID).user.tag };
					}
				}
			}
		}
		dbo.collection("users").findOne(query, function (err, result) {
			if(err) throw err;
			var cha = result;
			if(cha != null){
				makeProfile(message,cha.money,cha.xp,cha.level,tags);
				db.close();
			} else {
				if(args[0] != null){
					db.close();
					message.reply("this user isn't registered yet, have them try some other commands first!");
				} else {
					message.reply("you haven't been registered yet! Try some other commands first!");
					db.close();
				}
			}
		});
	  });
  }
  
	if(command === "setprefix"){
	  if(!message.member.hasPermission("ADMINISTRATOR"))
		  return message.reply("sorry, you don't have permissions to use this.");
	  
	  if(args[0].length > 10){
		  message.reply("guild prefix can't be longer than 10 characters");
	  } else {
		mongo.connect(ServerURL, function(err, db) {
			var dbo = db.db("servers");
			var query = { "serverID": message.guild.id };
			dbo.collection("servers").findOne(query, function(err, result ) {
				if(err) throw err;
				var t = result;
				t.prefix = args[0].toString();
				dbo.collection("servers").update(query, t, function (err, res) {
					if(err) throw err;
					message.reply("guild prefix updated to `" + args[0] + "`");
				});
			});
		});
	  }
	  
  }
  
	if(command === "help") {
    message.channel.send(helpMenu);
  }
  
}

function sendEmbed (m, result, money) {
	if(money == true) {
	m.channel.send ({embed: {
      color: 261888,
		"author": {
			"name": "Money leaderboard"
		},
      fields: [{
          name: `1: ${result[0].name}`,
          value: `$${result[0].money}`
        },
		{
          name: `2: ${result[1].name}`,
          value: `$${result[1].money}`
        },
        {
          name: `3: ${result[2].name}`,
          value: `$${result[2].money}`
        },
		{
          name: `4: ${result[3].name}`,
          value: `$${result[3].money}`
        },
        {
          name: `5: ${result[4].name}`,
          value: `$${result[4].money}`
        }
      ]
	}});
	} else {
		m.channel.send ({embed: {
			color: 8323327,
			"author": {
				"name": "Level leaderboard"
			},
			fields: [{
				name: `1: ${result[0].name}`,
				value: `Level: ${result[0].level}`
				},
				{
				name: `2: ${result[1].name}`,
				value: `Level: ${result[1].level}`
				},
				{
				name: `3: ${result[2].name}`,
				value: `Level: ${result[2].level}`
				},
				{
				name: `4: ${result[3].name}`,
				value: `Level: ${result[3].level}`
				},
				{
				name: `5: ${result[4].name}`,
				value: `Level: ${result[4].level}`
				}
			]
		}});
	}
}

function makeProfile (mes, money, xp, level, tag) {
	Jimp.read(pic, function (err, image) {
		if(err) throw err;
		mes.channel.startTyping(1);
		Jimp.loadFont (fon).then(function(font) {
			image.print(font,parseInt(process.env.NAME_X),parseInt(process.env.NAME_Y), tag).getBuffer(Jimp.MIME_JPEG, function (err, img) {
			if(err) throw err;
				Jimp.loadFont (fonTwo).then(function(font) {
					image.print(font,36,250, `XP ${xp} / ${level*150}`).getBuffer(Jimp.MIME_JPEG, function (err, img) {
						if(err) throw err;
						image.print(font,36,330, `Level ${level}`).getBuffer(Jimp.MIME_JPEG, function (err, img) {
							if(err) throw err;
							image.print(font,36,410, `$${money}`).getBuffer(Jimp.MIME_JPEG, function (err, img) {
								if(err) throw err;
								image.scale(0.35).write("/app/tempBal.jpg");
								mes.channel.send("", { files: ["/app/tempBal.jpg"]});
								mes.channel.stopTyping();
							});
						});
					});
				});
			});
		});
	});
}

function sepiaFunction (message, im) {
	Jimp.read(im, function (err, image) {
		if(err) {
			console.log(err);
			message.reply('are you sure this is a link?');
			//catch(err);
		} else {
			message.channel.startTyping(1);
			image.sepia(function (err, image) {
				image.write("/app/tempPic.png", function (err) {
					if(err) throw err;
					message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
				});
			});
		}
	});
}	

function posterFunction (message, f,im) {
	var r = Math.abs(parseFloat(f));
	if(isNaN(r)==false){
		Jimp.read(im, function (err, image) {
			if(err) {
				console.log(err);
				message.reply('are you sure this is a link?');
			} else {
				message.channel.startTyping(1);
				image.posterize(r,function (err, image) {
					image.write("/app/tempPic.png", function (err) {
						if(err) throw err;
						message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
					});
				});
			}
		});
	} else {
		message.reply(`you've done something wrong! Are you sure you did ${prefix}poster [intensity] [link/user]?`);
	}
}	

function greyscaleFunction (message, im) {
	Jimp.read(im, function (err, image) {
		if(err) {
			console.log(err);
			message.reply('are you sure this is a link?');
			//catch(err);
		} else {
			message.channel.startTyping(1);
			image.greyscale(function (err, image) {
				image.write("/app/tempPic.png", function (err) {
					if(err) throw err;
					message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
				});
			});
		}
	});
}	

function invertFunction (message, im) {
	Jimp.read(im, function (err, image) {
		if(err) {
			console.log(err);
			message.reply('are you sure this is a link?');
			//catch(err);
		} else {
			message.channel.startTyping(1);
			image.invert(function (err, image) {
				image.write("/app/tempPic.png", function (err) {
					if(err) throw err;
					message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
				});
			});
		}
	});
}	

function mirrorFunction (message, im) {
	Jimp.read(im, function (err, image) {
		if(err) {
			console.log(err);
			message.reply('are you sure this is a link?');
			//catch(err);
		} else {
			message.channel.startTyping(1);
			image.flip(true, false, function (err, image) {
				image.write("/app/tempPic.png", function (err) {
					if(err) throw err;
					message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
				});
			});
		}
	});
}	

function flipFunction (message, im) {
	Jimp.read(im, function (err, image) {
		if(err) {
			console.log(err);
			message.reply('are you sure this is a link?');
			//catch(err);
		} else {
			message.channel.startTyping(1);
			image.flip(false, true, function (err, image) {
				image.write("/app/tempPic.png", function (err) {
					if(err) throw err;
					message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
				});
			});
		}
	});
}	

function blurFunction (message, amount, im) {
	message.channel.startTyping(1);
	var a = Math.abs(parseInt (amount));
	if(isNaN(a)==false){
		Jimp.read(im, function (err, image) {
			message.channel.startTyping(1);
			if(err) {
				message.channel.stopTyping();
				console.log(err);
				message.reply('are you sure this is a link?');
			} else {
				image.blur(a, function (err, image) {
					if(err) message.reply(err);
					image.write("/app/tempPic.png", function (err) {
						if(err) throw err;
						message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
					});
				});
			}
		});
	} else {
				message.reply(`you've done something wrong! Are you sure you did ${prefix}blur [amount] [link/user]?`);
	}
}	

function rotateFunction (message, degrees, im) {
	var p = parseFloat(degrees);
	if(isNaN(p)==false){
		message.channel.startTyping(1);
		Jimp.read(im, function (err, image) {
			if(err) {
				message.channel.stopTyping();
				console.log(err);
				message.reply('are you sure this is a link?');
			} else {
					image.rotate(p, true, function(err){
						if(err) {
							message.reply(`you've done something wrong! Are you sure you did ${prefix}rotate [degrees] [link/user]?`);
							throw err;
						}
						image.write("/app/tempPic.png", function (err) {
							if(err) throw err;
							message.channel.send("", { files: ["/app/tempPic.png"]}).then(message.channel.stopTyping());
						});
					});
			}
		});
	} else {
		message.reply(`you've done something wrong! Are you sure you did ${prefix}rotate [degrees] [link/user]?`);
	}

}

function setup (message, author) {
	message.reply("please reply with your welcome channel").then(message => {
		const filter = m => m.author.tag.includes (author);
		message.channel.awaitMessages(filter, { max: 1, time: 60000, errors : ['time']})
			.then(collected => {
				setupChannel(collected,message, author);
			})
			.catch(collected => { 
				if(collected.size < 1)
					message.channel.send ("Setup cancelled, you took longer than 1 minute!");
			}
			);
	});
}

function setupChannel (collected, message, author) {
	var query = { "content": -1 };
	var c = collected.first().content.toString().replace(/[<#>]/g, '');
	var x = collected.first().content;
	if(client.channels.get(c)) {
		mongo.connect(ServerURL, function(err, db) {
			var dbo = db.db("servers");
			var query = { "serverID": message.guild.id };
			dbo.collection("servers").findOne(query, function(err, result ) {
				if(err) throw err;
				var r = result;
				r.welcomeChannel = c;
				dbo.collection("servers").update(query, r, function (err, res) {
					if(err) throw err;
					message.channel.send("Now send the name of the role you want people to get when they join").then(message=> {
						const filter2 = m => m.author.tag.includes (author);
						message.channel.awaitMessages(filter2, { max: 1, time: 60000, errors : ['time']})
							.then(c => {
								//console.log(c.first().content);
								var role = c.first().content.toString();
								//console.log(message.channel.guild.roles.exists("name", role));
								if(message.channel.guild.roles.exists("name", role)) {
									r.welcomeRole = role;
									var dbo = db.db("servers");
									var query = { "serverID": message.guild.id };
									dbo.collection("servers").update(query, r,function(err, result ) {
										if(err) throw err;
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
								if(c.size < 1) {
									message.channel.send ("Setup cancelled, you took longer than 1 minute!");
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


client.login(process.env.BOT_TOKEN);


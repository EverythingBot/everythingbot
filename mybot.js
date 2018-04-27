
const Discord = require("discord.js");
const Attachment = require("discord.js").Attachment;
var ms = require("ms");
var mongo = require("mongodb").MongoClient;
var welcomerole = false;

//MongoDB URL
var UserURL = "mongodb://Ironfacebuster:Greenetech1@ds259109.mlab.com:59109/users";
var ServerURL = "mongodb://Ironfacebuster:Greenetech1@ds014368.mlab.com:14368/servers";
//Discord.js Client
const client = new Discord.Client();

var prefix = 'e!';

var defaultServer = {
	"serverID":null,
	"prefix":'e!'
}

var defaultUser = {
	name:null,
	"money":0,
	"xp":0,
	"level":1,
}

mongo.connect(UserURL, function(err, db) {
	if(err) throw err;
	console.log("Connected to mLab!");
	var dbo = db.db("users");
});

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
  defaultChannel.send("Thanks for inviting me to the server! I'm **EverythingBot**. If you need any help, type `e!help`. \r\nIf you have any questions, contact the dev `Yer Good Ol' Loli Grandpappy#8486`");
  mongo.connect(ServerURL, function(err, db) {
	  var dbo = db.db("servers");
	  var serv = defaultServer;
	  serv.serverID = guild.id;
	  dbo.collection("servers").insertOne(serv, function(err, obj) {
		  if(err) throw err;
		  db.close();
	  });
  });
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`on ${client.guilds.size} servers | e!help`);
});

client.on("guildmemberadd", guild => {
  if (welcomerole == false) {

  }
  else {
    user.addRole(welcomerole)
      .then(console.log)
      .catch(console.error);
  }
});

client.on("guildDelete", guild => {
  mongo.connect(ServerURL, function(err, db) {
  var dbo = db.db("servers");
  var query = { "serverID": guild.id };
	dbo.collection("servers").findOne(query, function (err, result) {
		if(err) throw err;
		dbo.collection("servers").deleteOne(query, function(err, obj) {
			if(err) throw err;
			db.close();
		});
	});
  });
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`on ${client.guilds.size} servers | e!help`);
});

client.on("message", async message => {
	mongo.connect(ServerURL, function(err, db) {
		var dbo = db.db("servers");
		var query = { "serverID": message.guild.id };
		dbo.collection("servers").find(query).toArray (function (err, result) {
			if(err) throw err;
			prefix = result[0].prefix;
			checkCommand(message,prefix);
		});
	});
});

client.on("message", async message => {
	
	var ran = Math.floor(Math.random()*100);
	
	if(ran > 75){
		mongo.connect(UserURL, function(err, db) {
			var dbo = db.db("users");
			var query = { "name": message.author.tag };
			dbo.collection("users").findOne(query, function (err, result) {
				if(err) throw err;
				if(result != null){
					var upd = result;
					upd.xp = result.xp + Math.floor(Math.random()*5)+1;
					dbo.collection("users").update(query, upd, function (err, res){
						if(err) throw err;
					});
				}
			});
		});
	}
	
	mongo.connect(UserURL, function(err, db) {
		var dbo = db.db("users");
		var query = { "name": message.author.tag };
		dbo.collection("users").findOne(query, function (err, result) {
			if(err) throw err;
			if(result != null){
				var upd = result;
				if(result.xp > Math.floor(result.level * 150)){
					message.reply(`you've leveled up! Your new level is ${upd.level + 1}.`);
					upd.xp = result.xp - result.level * 150;
					upd.level += 1;
					dbo.collection("users").update(query, upd, function (err, res){
						if(err) throw err;
					});
				}
			}
		});
	});
});

async function checkCommand (message, prefix) {
	
	if(message.author.bot) return;

	if(message.content.indexOf(prefix) !== 0) return;
	
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	var col = null;
	
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

	if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Ping is ${m.createdTimestamp - message.createdTimestamp}ms. API ping is ${Math.round(client.ping)}ms`);
  }

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
        return message.reply("Sorry, you don't have permissions to use this.");
    }

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("This user doesn't exist.");
    if(!member.kickable)
      return message.reply("User wasn't kicked. Make sure that I have `kick members` permissions, and that the user is kick-able.");
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
   message.channel.send(`You can invite me with this link: https://discordapp.com/api/oauth2/authorize?client_id=438881380500373504&permissions=8&scope=bot`);
  }

	if (command === "kill" || command === "die") {
    var listOfRoasts = [
      "You died of dysentery",
      "no u",
      "no u",
      "no u"
    ];
    let member = message.mentions.members.first();
    if (!member) return message.reply("I can't roast someone that isn't a person, **smh.**");
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
      "Shut up, you'll never be the man your mother is.",
      "You're a failed abortion whose birth certificate is an apology from the condom factory.",
      "You must have been born on a highway, because that's where most accidents happen.",
      "Your family tree is a cactus, because everybody on it is a prick.",
      "You're so ugly Hello Kitty said goodbye to you.",
      "You are so ugly that when your mama dropped you off at school she got a fine for littering.",
      "It looks like your face caught on fire and someone tried to put it out with a fork.",
      "Do you have to leave so soon? I was just about to poison the tea.",
      "Your so ugly when you popped out the doctor said aww what a treasure and your mom said yeah lets bury it",
      "We all sprang from apes, but you didn't spring far enough.",
      ", you are the equivalent of a gential piercing",
      "when I think of you, I think of world hunger, children dying, and paralyzed soldiers",
      " tried to donate his hair to children with cancer. They said \“don’t we got enough problems now you want us to look like fags\”",
      "you remind me of a middle aged man who just got a divorce. You sit in your room playing on your computer noodling around with these bots when all you’re doing is reminding yourself of how much a complete and utter failure you are.",
      "why are you hanging out with teenagers? Shouldn’t you be at the nursing home playing shuffleboard with your 80 year old girlfriend?",
      "Your life is like a steak at a vegan resteraunt. It doesn’t cross the place",
      "What’s the difference between you and a brain tumor? You can get a brain tumor removed.",
      "is so ugly her face was shut down by the health department.",
      "is so ugly that when she met the Kardashians they thought she was a fourth grader with cancer.",
      "is so poor she waves around a popsicle and calls it air conditioning.",
      "You're an example of why animals eat their young.",
      "I would shoot you, but that would be disrespectful to the bullet",
      "You’re so fat that when you step on a scale it says: \“I need your weight not your phone number\”"
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
			query = { name: message.author.tag };
		} else {
			if(args[0].toString().includes('@')){
				if(args[0]!='@here'&&args[0]!='@everyone'&&args[0]!='@someone'){
					ID = args[0].replace(/[<@!>]/g, '');
					if(client.users.get(ID)){
						query = { name: message.guild.member(ID).user.tag };
					}
				}
			}
		}
		dbo.collection("users").findOne(query, function (err, result) {
			if(err) throw err;
			var cha = result;
			if(cha != null){
				message.channel.send({
					"embed": {
						"title": `${message.guild.member(ID).user.username}'s stats`,
						"color": 7510071,
						"timestamp": new Date(),
						"footer": {
							"text": "EverythingBot"
						},
						"fields": [
						{
							"name": "Money",
							"value": cha.money
						},
						{
							"name": "Level",
							"value": cha.level
						},
						{
							"name": "XP",
							"value": cha.xp
						}]
					}
				});
			} else {
				if(args[0] != null){
					message.reply("this user isn't registered yet, have them try some other commands first!");
				} else message.reply("you haven't been registered yet! Try some other commands first!");
			}
			db.close();
		});
	  });
  }
  
	if(command === "setprefix"){
	  if(!message.member.hasPermission("ADMINISTRATOR")) {
		  return message.reply("sorry, you don't have permissions to use this.");
	  }
	  mongo.connect(ServerURL, function(err, db) {
		var dbo = db.db("servers");
		var query = { "serverID": message.guild.id };
		dbo.collection("servers").findOne(query, function(err, result ) {
			if(err) throw err;
			var t = defaultServer;
			t.serverID = message.guild.id;
			t.prefix = args[0].toString();
			dbo.collection("servers").update(query, t, function (err, res) {
				if(err) throw err;
				message.reply("guild prefix updated to `" + args[0] + "`");
			});
		});
	  });
  }
  
	if(command === "help") {
    message.channel.send({embed: {
      color: 3447003,
      author: {
        name: client.user.username,
        icon_url: client.user.avatarURL
      },
      description: "EverythingBot, does literally everything (Still in production, currently doesn't do much). Here's the list of commands",
      fields: [{
          name: ":straight_ruler:  Admin/Mod",
          value: "clear, kick, ban, unban, mute, unmute, setprefix"
        },
        {
          name: ":laughing: Fun commands",
          value: "meme, pickup, insult, mock, kill, gayray"
        },
		{
          name: ":briefcase: User commands",
          value: "bal, pay"
        },
        {
          name: ":regional_indicator_t: :regional_indicator_e: :regional_indicator_x: :regional_indicator_t:  commands",
          value: "ping, say, bigtext, mention, announce, invite, server"
        },
		{
          name: ":thinking: Etc commands",
          value: "credits"
        }
      ],
      footer: {
        text: `This guild's prefix is: ${prefix}`
      }
    }
  });

  }
  
}

client.login(process.env.BOT_TOKEN);
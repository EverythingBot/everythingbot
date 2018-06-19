exports.run = (client, message, args, mongo) => {

  var ms = require("ms");

  const sayMessage = args.join(" ");
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    return message.reply("sorry, you don't have permissions to use this.");
  }

  let member = message.mentions.members.first();
  if (!member) return message.reply("that isn't a user.");
  let muteRole = message.guild.roles.find("name", "eBot Mute");
  if (!muteRole) return message.reply("the `eBot Mute` role wasn't found! Make sure you have a role sharing this name, and that it wasn't deleted.");
  let params = message.content.split(" ").slice(1);
  let time = params[1];
  if (!time) return message.reply(`no time was specified.`)

  member.addRole(muteRole.id);
  message.reply ("you've muted `" +  member.user.tag + "` for " +  ms(ms(time), {long:true}));

  setTimeout(function() {
    member.removeRole(muteRole.id);
    message.channel.send('`' + member.user.tag + '` has been unmuted.');
  }, ms(time));
}

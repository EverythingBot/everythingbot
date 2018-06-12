exports.run = (client, message, args, mongo) => {
  const sayMessage = args.join(" ");
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    return message.reply("sorry, you don't have permissions to use this.");
  }

  let member = message.mentions.members.first();
  if (!member) return message.reply("That isn't a user.");
  let muteRole = message.guild.roles.find("name", "Muted");
  if (!muteRole) return message.reply("You haven't configured the `Muted` role yet. Please go to roles, and add `Muted` as a role. In `Muted`'s permissions, disable send messages.");
  let params = message.content.split(" ").slice(1);
  let time = params[1];
  if (!time) return message.reply(`there is no time specified. Please use this command in the form of ${config.prefix}`)

  member.addRole(muteRole.id);
  message.channel.send(`You've been muted for ${ms(ms(time), {long:true})} ${member.user.tag}`);

  setTimeout(function() {
    member.removeRole(muteRole.id);
    message.channel.send(`${member.user.tag} has been unmuted.`);
  }, ms(time));
}

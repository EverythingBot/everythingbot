exports.run = (client, message, args, mongo) => {
  const sayMessage = args.join(" ");
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    return message.reply("sorry, you don't have permissions to use this.");
  }

  let member = message.mentions.members.first();
  if (!member) return message.reply("That isn't a user.");
  let muteRole = message.guild.roles.find("name", "eBot Mute");
  if (!muteRole) return message.reply("You haven't configured the `eBot Mute` role yet. Please go to roles, and add `eBot Mute` as a role. In `eBot Mute`'s permissions, disable send messages.");

  if (member.roles.find("name", "eBot Mute")) {
    member.removeRole(muteRole.id);
    message.channel.send("`" + member.user.tag + "` has been unmuted.");
  } else
    message.channel.send("`" + member.user.tag + "` isn't muted!");
}

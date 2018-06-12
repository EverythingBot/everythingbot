exports.run = async function (client, message, args, mongo) {
  if (!message.member.hasPermission("KICK_MEMBERS")) {
    return message.reply("sorry, you don't have permissions to use this.");
  }

  let member = message.mentions.members.first();
  if (!member)
    return message.reply("this user doesn't exist.");
  if (!member.kickable)
    return message.reply("user wasn't kicked. Make sure that I have `kick members` permissions, and that the user is kick-able.");
  let reason = args.slice(1).join(' ');
  if (!reason)
    return message.reply("Please indicate a reason for the kick.");
  try {
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  } catch (e) {
    console.log(e);
  }
  try {
    message.mentions.members.first().user.send("You have been kicked from " + message.channel.guild.name + ". You can still join back with an invite link!");
  } catch (e) {
    console.log(e);
  }
  await member.kick(reason)
    .catch(error => message.reply(`sorry ${message.author} I couldn't kick because of : ${error}`));
}

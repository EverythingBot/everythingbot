exports.run = async function (client, message, args, mongo) {
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    return message.reply("sorry, you don't have permissions to use this.");
  }

  let member = message.mentions.members.first();
  if (!member)
    return message.reply("This user does not exist.");
  if (!member.bannable)
    return message.reply("This user wasn't banned. Make sure that I have ban members permissions, and that the user is ban-able.");
  let reason = args.slice(1).join(' ');
  if (!reason)
    return message.reply("Please indicate a reason for the ban.");
  try {
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  } catch (e) {
    console.log(e);
  }
  try {
    message.mentions.members.first().user.send("You've been banned from " + message.channel.guild.name + ". You can't join unless you are unbanned.");
  } catch (e) {
    console.log(e);
  }
  await member.ban(reason)
    .catch(error => message.reply(`sorry, ${message.author}, I couldn't ban because of : ${error}`));
}

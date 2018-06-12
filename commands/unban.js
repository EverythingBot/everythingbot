exports.run = (client, message, args, mongo) => {
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    return message.reply("sorry, you don't have permissions to use this.");
  }

  const sayMessage = args.join(" ");
  let bansd;
  message.guild.fetchBans()
    .then(bans => {
      console.log(bans);
      let id = bans.find(function(element) {
        console.log(element.username + " is " + (element.username == sayMessage));
        return element.username == sayMessage;
      });
      if (id == null) {
        message.reply(`User isn't banned.`);
      } else {
        console.log(id);
        message.guild.unban(id)
          .then(user => message.reply(`Unbanned ${user.username} from ${message.guild}`))
          .catch(console.error);
      }

    })
    .catch(console.error);
}

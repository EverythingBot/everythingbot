exports.run = (client, message, args, mongo) => {
  var listOfRoasts = [
    "You died of dysentery",
    "no u",
    "no u",
    "no u"
  ];
  let member = message.mentions.members.first();
  if (!member) return message.reply("I can't kill someone that isn't a person, **smh.**");
  let rand = Math.floor((Math.random() * (listOfRoasts.length - 1)) + 1);
  if (listOfRoasts[rand] == "no u") {
    message.channel.send(listOfRoasts[rand]);
  } else {
    message.channel.send(member.toString() + " " + listOfRoasts[rand]);
  }
}

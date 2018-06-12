exports.run = (client, message, args, mongo) => {
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
  let rand = Math.floor((Math.random() * (listOfRoasts.length - 1)) + 1);
  message.channel.send(member.toString() + " " + listOfRoasts[rand]);
}

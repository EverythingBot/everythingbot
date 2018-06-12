exports.run = (client, message, args, mongo) => {
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
    "is so ugly their face was shut down by the health department.",
    "is so ugly that when she met the Kardashians they thought she was a fourth grader with cancer.",
    "is so poor she waves around a popsicle and calls it air conditioning.",
    "you're an example of why animals eat their young.",
    "I would shoot you, but that would be disrespectful to the bullet",
    "you’re so fat that when you step on a scale it says: \“I need your weight not your phone number\”"
  ];
  let member = message.mentions.members.first();
  if (!member) return message.reply("I can't roast someone that isn't a person smh.");
  let rand = Math.floor((Math.random() * (listOfRoasts.length - 1)) + 1);
  if (listOfRoasts[rand] == "no u") {
    message.channel.send(listOfRoasts[rand]);
  } else {
    message.channel.send(member.toString() + " " + listOfRoasts[rand]);
  }
}

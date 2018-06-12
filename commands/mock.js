exports.run = (client, message, args, mongo) => {
  const sayMessage = args.join(" ");
  let a = "";
  for (var i = 0; i < sayMessage.length; i++) {
    if (i % 2 == 0) {
      a = a + sayMessage.charAt(i).toLowerCase();
    } else {
      a = a + sayMessage.charAt(i).toUpperCase();
    }
  }
  message.channel.send(a);
}

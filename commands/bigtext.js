exports.run = (client, message, args, mongo) => {
  if (args[0] == null) {
    message.reply("I can't make **nothing** into :regional_indicator_b: :regional_indicator_i: :regional_indicator_g: text!").then(message => {
      message.delete(5000).catch(console.error);
    });
    return;
  }
  var contains = function(needle) {
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
      indexOf = Array.prototype.indexOf;
    } else {
      indexOf = function(needle) {
        var i = -1,
          index = -1;

        for (i = 0; i < this.length; i++) {
          var item = this[i];

          if ((findNaN && item !== item) || item === needle) {
            index = i;
            break;
          }
        }
        return index;
      };
    }
    return indexOf.call(this, needle) > -1;
  };
  const list = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  const sayMessage = args.join(" ");
  let messageSend = "";
  for (let i = 0; i < sayMessage.length; i++) {
    if (sayMessage.charAt(i) !== " ") {
      if (contains.call(list, (sayMessage.charAt(i).toLowerCase()))) {
        messageSend = messageSend + " :regional_indicator_" + sayMessage.charAt(i).toLowerCase() + ":";
      }
    } else {
      messageSend = messageSend + "    ";
    }
  }
  message.channel.send(messageSend);
}

exports.run = async function (client, message, args, mongo) {
  const m = await message.channel.send("Ping?");
  m.edit({
    embed: {
      color: 3447003,
      description: "Pong!",
      fields: [{
          name: "Ping",
          value: `${m.createdTimestamp - message.createdTimestamp}ms`
        },
        {
          name: "API Ping",
          value: `${Math.round(client.ping)}ms`
        }
      ]
    }
  });
}

exports.run = (client, message, args, mongo) => {
  const number = args.join(" ");
  async function purge() {
    message.delete();
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
      message.channel.send('You need the \`Manage Messages\` permission to use this command.');
      return;
    }

    if (isNaN(number)) {
      message.channel.send('Please use a number as your arguments. \n Usage: ' + prefix + 'purge <amount>');
      return;
    }

    const fetched = await message.channel.fetchMessages({
      limit: number
    });

    message.channel.bulkDelete(fetched)
      .catch(error => message.channel.send(`Error: ${error}`));

  }
  try {
    purge();
  } catch (e) {
    console.log(e);
  }
}

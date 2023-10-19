const { Permissions } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    if (!interaction.memberPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      await interaction.reply({ content: 'You do not have the required permissions to run this command.', ephemeral: true })
        .catch(console.error);
      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction)
        .catch(console.error);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true })
        .catch(console.error);
    }
  },
};
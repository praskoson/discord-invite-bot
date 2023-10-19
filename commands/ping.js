const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Measure network latency.'),
  async execute(interaction) {
    const timeTaken = Date.now() - interaction.createdTimestamp;
    await interaction.reply({ content: `Pong! This message had a latency of ${timeTaken}ms.`, ephemeral: true });
  },
};

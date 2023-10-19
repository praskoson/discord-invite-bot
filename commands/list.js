const { SlashCommandBuilder } = require('@discordjs/builders');
const { getData } = require('../models/invites');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List existing server invites and their associated roles.'),
  async execute(interaction) {
    const data = getData();
    await interaction.reply({ content: `\`\`\`\n${JSON.stringify(data, null, 2)}\n\`\`\``, ephemeral: true });
  },
};

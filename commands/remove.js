const { SlashCommandBuilder } = require('@discordjs/builders');
const { removeInviteRole } = require('../models/invites');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a role attached to an invite link')
    .addStringOption(option =>
      option.setName('invite-link')
        .setDescription('The invite link')
        .setRequired(true))
    .addRoleOption(roleOption =>
      roleOption.setName('attached-role')
        .setDescription('Role previously attached to the invite link that will be removed')
        .setRequired(true)),
  async execute(interaction) {
    const inviteUrl = interaction.options.getString('invite-link');
    const role = interaction.options.getRole('attached-role');

    const base = 'https://discord.gg/';
    if (inviteUrl.substring(0, base.length) !== base) {
      await interaction.reply({ content: `⚠ Missing link starting with \`${base}\``, ephemeral: true });
      return;
    }

    const inviteCode = inviteUrl.substring(base.length);

    if (removeInviteRole(inviteCode, role)) {
      await interaction.reply({
        content: `Role <@&${role.id}> and invite link \`${base + inviteCode}\` pairing removed.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({ content: '⚠ Invalid link or role', ephemeral: true });
    }
  },
};
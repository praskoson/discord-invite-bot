const { SlashCommandBuilder } = require('@discordjs/builders');
const { addInviteRole } = require('../models/invites');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Attach a role to an invite link.')
    .addStringOption(option =>
      option.setName('invite-link')
        .setDescription('The invite link')
        .setRequired(true))
    .addRoleOption(roleOption =>
      roleOption.setName('attached-role')
        .setDescription('Role assigned to users that join via the invite link')
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

    addInviteRole(inviteCode, role);

    await interaction.reply(
      { content: `Role <@&${role.id}> added to invite link \`${base + inviteCode}\``, ephemeral: true },
    );
  },
};


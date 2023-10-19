const { guildInviteCache, getInviteRole } = require('../models/invites');
const config = require('../config.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    // new guildInvites
    const guildInvites = await member.guild.invites.fetch()
      .catch(console.error);

    // This is the *existing* invites for the guild.
    const ei = guildInviteCache[member.guild.id];

    guildInviteCache[member.guild.id] = new Map(guildInvites.map(invite => [invite.code, invite.uses]));

    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find(i => i.uses > ei.get(i.code));

    if (invite !== null) {
      let _roles = [];
      const inviteRole = await getInviteRole(member, invite);

      _roles.push(inviteRole);

      if (member.user.username.includes('🔓')) {
        const emojiRole = await member.guild.roles.fetch(config.USERNAME_ROLE_ID);
        _roles.push(emojiRole);
      }

      if (_roles.length === 0) {
        return;
      }

      _roles = _roles.filter(r => r);
      await member.roles.set(_roles).catch(console.error);

      const logChannel = await member.client.channels.fetch(config.LOG_CHANNEL_ID);
      const rolesString = _roles.map(r => `<@&${r.id}>`).join(', ');

      const embed = {
        color: '#0099ff',
        title: 'User joined',
        description: `${member.user.tag} | ${member.user.id}`,
        fields: [
          { name: 'Invite code', value: invite.code, inline: true },
          { name: 'Added roles', value: rolesString, inline: true },
        ],
        footer: { text: `${new Date().toLocaleTimeString('hr-HR')}` },
      };

      logChannel.send({ embeds: [embed] });
    }
  },
};
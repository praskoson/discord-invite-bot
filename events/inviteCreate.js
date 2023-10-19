const { guildInviteCache } = require('../models/invites');
require('../types');

module.exports = {
  name: 'inviteCreate',
  /**
   * @param {Invite} invite
   */
  execute(invite) {
    guildInviteCache[invite.guild.id].set(
      invite.code,
      invite.uses,
    );
  },
};
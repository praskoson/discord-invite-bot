const { guildInviteCache } = require('../models/invites');

module.exports = {
  name: 'inviteDelete',
  execute(invite) {
    // Delete the Invite from Cache
    guildInviteCache[invite.guild.id].delete(invite.code);
  },
};
const wait = require('util').promisify(setTimeout);
const { guildInviteCache } = require('../models/invites');
require('../types');

module.exports = {
  name: 'ready',
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    // "ready" isn't really ready. We need to wait a spell.
    await wait(1000);
    client.guilds.cache.forEach(async guild => {
      // Fetch all Guild Invites
      const firstInvites = await guild.invites.fetch({ cache: false });
      // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
      guildInviteCache[guild.id] = new Map(
        firstInvites.map(invite => [invite.code, invite.uses]),
      );
    });

    console.log('Ready');
  },
};

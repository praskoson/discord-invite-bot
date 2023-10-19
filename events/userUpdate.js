const config = require('../config.json');
require('../types');

async function addRole(member, role) {
  if (member.roles.cache.has(role)) {
    return null;
  } else {
    return member.roles.add(role).catch(console.error);
  }
}

/**
 *
 * @param {User} oldUser
 * @param {User} newUser
 * @returns
 */
async function userUpdate(oldUser, newUser, guild) {
  if (oldUser.username !== newUser.username) {
    const emojiRole = await guild.roles.fetch(config.USERNAME_ROLE_ID)
      .catch(console.error);

    return {
      role: emojiRole,
      substring: config.USERNAME_SUBSTRING,
    };
  }
}

module.exports = {
  name: 'userUpdate',
  /**
   * @param {User} oldUser
   * @param {User} newUser
   * @returns
   */
  async execute(oldUser, newUser) {
    const guild = await newUser.client.guilds.fetch(config.GUILD_ID)
      .catch(console.error);

    const userUpdateInfo = await userUpdate(oldUser, newUser, guild);
    if (!userUpdateInfo) return;

    const { role, substring } = userUpdateInfo;
    const oldName = oldUser.username ?? '<empty>';
    const newName = newUser.username ?? '<empty>';

    const logChannel = await newUser.client.channels.fetch(config.LOG_CHANNEL_ID)
      .catch(console.error);

    const embed = {
      color: '#0099ff',
      title: 'Username updated',
      description: `${newUser.tag} | ${newUser.id}`,
      fields: [
        { name: 'Old username', value: oldName, inline: true },
        { name: 'New username', value: newName, inline: true },
      ],
      footer: { text: `${new Date().toLocaleTimeString('hr-HR')}` },
    };

    const member = await guild.members.fetch({ user: newUser })
      .catch(console.error);

    if (role && newName?.includes(substring)) {
      const result = await addRole(member, role)
        .catch(console.error);

      if (result) {
        embed.fields.push(
          { name: 'Added roles', value: `<@&${role.id}>`, inline: false },
        );
        logChannel.send({ embeds: [embed] })
          .catch(console.error);
      }
    } else if (member.roles.cache.some(r => r.id === role.id)) {
      await member.roles.remove(role)
        .catch(console.error);

      embed.fields.push(
        { name: 'Removed roles', value: `<@&${role.id}>`, inline: false },
      );

      logChannel.send({ embeds: [embed] })
        .catch(console.error);
    }
  },
};
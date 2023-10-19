const config = require('../config.json');
require('../types');

async function addRole(member, role) {
  if (member.roles.cache.has(role)) {
    return null;
  } else {
    return member.roles.add(role).catch(console.error);
  }
}

async function memberUpdate(oldMember, newMember) {
  if (
    (oldMember.nickname && !newMember.nickname) ||
      (!oldMember.nickname && newMember.nickname) ||
      (oldMember.nickname !== newMember.nickname)
  ) {
    const emojiRole = await newMember.guild.roles
      .fetch(config.NICKNAME_ROLE_ID)
      .catch(console.error);

    return {
      oldName: oldMember?.nickname,
      newName: newMember?.nickname,
      role: emojiRole,
      type: 'Nickname',
      substring: config.NICKNAME_SUBSTRING,
    };
  }
}

module.exports = {
  name: 'guildMemberUpdate',
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   * @returns
   */
  async execute(oldMember, newMember) {
    const memberUpdateInfo = await memberUpdate(oldMember, newMember)
      .catch(console.error);

    if (!memberUpdateInfo) return;

    const { role, type, substring } = memberUpdateInfo;
    const oldName = memberUpdateInfo.oldName ?? '<empty>';
    const newName = memberUpdateInfo.newName ?? '<empty>';

    const logChannel = await oldMember.client.channels.fetch(config.LOG_CHANNEL_ID)
      .catch(console.error);

    const embed = {
      color: '#0099ff',
      title: `${type} updated`,
      description: `${newMember.user.tag} | ${newMember.id}`,
      fields: [
        { name: `Old ${type.toLowerCase()}`, value: oldName, inline: true },
        { name: `New ${type.toLowerCase()}`, value: newName, inline: true },
      ],
      footer: { text: `${new Date().toLocaleTimeString('hr-HR')}` },
    };

    if (role && newName?.includes(substring)) {
      const result = await addRole(newMember, role)
        .catch(console.error);

      if (result) {
        embed.fields.push(
          { name: 'Added roles', value: `<@&${role.id}>`, inline: false },
        );

        logChannel.send({ embeds: [embed] })
          .catch(console.error);
      }
    } else if (newMember.roles.cache.some(r => r.id === role.id)) {
      await newMember.roles.remove(role)
        .catch(console.error);

      embed.fields.push(
        { name: 'Removed roles', value: `<@&${role.id}>`, inline: false },
      );

      logChannel.send({ embeds: [embed] })
        .catch(console.error);
    }
  },
};
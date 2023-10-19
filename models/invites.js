const path = require('path');
const fs = require('fs');
const isEqual = require('lodash.isequal');
require('../types');

const _db = path.join(__dirname, '..', 'invites.json');

// Initialize invite cache
const guildInviteCache = {};

/**
 * @param {GuildMember} member
 * @param {Invite} invite
 * @returns {Promise<Role | null>}
 * @throws Will throw if role fetching fails.
 */
async function getInviteRole(member, invite) {
  const rawdata = fs.readFileSync(_db);
  const _invites = JSON.parse(rawdata);

  const _invite = _invites[invite.code] || null;
  if (_invite && _invite.roleID) {
    try {
      return member.guild.roles.fetch(_invite.roleID);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

/**
 * @typedef {import('discord.js').Role} Role
 *
 * @param {string} inviteCode
 * @param {Role} role
 */
function addInviteRole(inviteCode, role) {
  const invites = JSON.parse(fs.readFileSync(_db));

  invites[inviteCode] = { roleID: role.id, name: role.name };

  const data = JSON.stringify(invites, null, 2);
  fs.writeFileSync(_db, data);
}

/**
 * @typedef {import('discord.js').Role} Role
 *
 * @param {string} inviteCode
 * @param {Role} role
 * @returns {boolean} true if the invite/role is removed, false otherwise.
 */
function removeInviteRole(inviteCode, role) {
  const invites = JSON.parse(fs.readFileSync(_db));

  if (
    !invites[inviteCode] ||
    !isEqual(invites[inviteCode], { roleID: role.id, name: role.name })
  ) {
    return false;
  }

  delete invites[inviteCode];
  const data = JSON.stringify(invites, null, 2);
  fs.writeFileSync(_db, data);

  return true;
}

function getData() {
  const rawdata = fs.readFileSync(_db);
  const invites = JSON.parse(rawdata);
  return invites;
}

module.exports = {
  guildInviteCache,
  getInviteRole,
  addInviteRole,
  removeInviteRole,
  getData,
};

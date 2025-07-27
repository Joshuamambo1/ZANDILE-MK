// ==========================
// Required Modules
// ==========================
const config = require('../settings')
const { zandile, commands } = require('../zandile')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')

// ==========================
// Helper: Custom Message Sender
// ==========================
const sendCustomMessage = async (conn, from, message, mek, m) => {
    await conn.sendMessage(from, {
        image: { url: `https://files.catbox.moe/jog59s.jpg` },
        caption: message,
        contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363347365643318@newsletter',
                newsletterName: '🤖 ᴢᴀɴᴅɪʟᴇ-ᴍᴋ ',
                serverMessageId: 143
            }
        }
    }, { quoted: mek });
}



// ==================== KICK COMMAND ====================
zandile({
  pattern: "kick",
  alias: ["k", "remove", "nital"],
  desc: "Remove a user from the group",
  category: "group",
  react: "✅",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  quoted,
  reply,
  botNumber
}) => {
  try {
    if (!isGroup) return reply("⚠️ This command only works in *groups*.");
    if (!isBotAdmins) return reply("❌ I must be *admin* to remove someone.");
    if (!isAdmins && !isCreator) return reply("🔐 Only *group admins* or *owner* can use this command.");

    // Consistent user extraction logic
    if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
      return reply("❓ You did not give me a user to remove!");
    }

    let users = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : null;

    if (!users) return reply("⚠️ Couldn't determine target user.");

    // Protection checks
    if (users === botNumber) return reply("🤖 I can't kick myself!");
    const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';
    if (users === ownerJid) return reply("👑 That's the owner! I can't remove them.");

    /*await conn.groupParticipantsUpdate(from, [users], "remove");
    reply(`*✅ Successfully removed from group.*`, { mentions: [users] });*/
      await conn.groupParticipantsUpdate(from, [users], "remove");
await sendCustomMessage(conn, from, `*✅ Successfully removed from group.*`, mek, m);


  } catch (err) {
    console.error(err);
    reply("❌ Failed to remove user. Something went wrong.");
  }
});

// ==================== PROMOTE COMMAND ====================
zandile({
  pattern: "promote",
  alias: ["p", "giveadmin", "makeadmin"],
  desc: "Promote a user to admin",
  category: "group",
  react: "✅",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  quoted,
  reply,
  botNumber
}) => {
  try {
    if (!isGroup) return reply("⚠️ This command only works in *groups*.");
    if (!isBotAdmins) return reply("❌ I must be *admin* to promote someone.");
    if (!isAdmins && !isCreator) return reply("🔐 Only *group admins* or *owner* can use this command.");

    // Consistent user extraction logic
    if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
      return reply("❓ You did not give me a user to promote!");
    }

    let users = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : null;

    if (!users) return reply("⚠️ Couldn't determine target user.");

    // Protection checks
    if (users === botNumber) return reply("🤖 I can't promote myself!");
    const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';
    if (users === ownerJid) return reply("👑 Owner is already super admin!");

   /* await conn.groupParticipantsUpdate(from, [users], "promote");
    reply(`*✅ Successfully Promoted to Admin.*`, { mentions: [users] });*/
      await conn.groupParticipantsUpdate(from, [users], "promote");
await sendCustomMessage(conn, from, `*✅ Successfully Promoted to Admin.*`, mek, m);


  } catch (err) {
    console.error(err);
    reply("❌ Failed to promote. Something went wrong.");
  }
});

// ==================== DEMOTE COMMAND ====================
zandile({
  pattern: "demote",
  alias: ["d", "dismiss", "removeadmin"],
  desc: "Demote a group admin",
  category: "group",
  react: "✅",
  filename: __filename
}, async (conn, mek, m, {
  from,
  isCreator,
  isBotAdmins,
  isAdmins,
  isGroup,
  quoted,
  reply,
  botNumber
}) => {
  try {
    if (!isGroup) return reply("⚠️ This command only works in *groups*.");
    if (!isBotAdmins) return reply("❌ I must be *admin* to demote someone.");
    if (!isAdmins && !isCreator) return reply("🔐 Only *group admins* or *owner* can use this command.");

    // Consistent user extraction logic
    if (!m.quoted && (!m.mentionedJid || m.mentionedJid.length === 0)) {
      return reply("❓ You did not give me a user to demote!");
    }

    let users = m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.quoted
      ? m.quoted.sender
      : null;

    if (!users) return reply("⚠️ Couldn't determine target user.");

    // Protection checks
    if (users === botNumber) return reply("🤖 I can't demote myself!");
    const ownerJid = conn.user.id.split(":")[0] + '@s.whatsapp.net';
    if (users === ownerJid) return reply("👑 I can't demote the owner!");

    /*await conn.groupParticipantsUpdate(from, [users], "demote");
    reply(`*✅ Admin Successfully demoted to a normal member.*`, { mentions: [users] });*/
      await conn.groupParticipantsUpdate(from, [users], "demote");
await sendCustomMessage(conn, from, `*✅ Admin Successfully demoted to a normal member.*`, mek, m);


  } catch (err) {
    console.error(err);
    reply("❌ Failed to demote. Something went wrong.");
  }
});

// ==========================
// Leave Group Command
// ==========================
zandile({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc","exit"],
    desc: "Leave the group",
    react: "👋",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, senderNumber }) => {
    try {
        if (!isGroup) {
            return await sendCustomMessage(conn, from, "This command can only be used in groups.", mek, m);
        }
        const botOwner = conn.user.id.split(":")[0]; 
        if (senderNumber !== botOwner) {
            return await sendCustomMessage(conn, from, "Only the bot owner can use this command.", mek, m);
        }
        await sendCustomMessage(conn, from, "Leaving group...", mek, m);
        await sleep(1500);
        await conn.groupLeave(from);
        await sendCustomMessage(conn, from, "Goodbye! 👋", mek, m);
    } catch (e) {
        console.error(e);
        await sendCustomMessage(conn, from, `❌ Error: ${e}`, mek, m);
    }
});


// ==========================
// Add Member Command
// ==========================
zandile({
    pattern: "add",
    alias: ["a", "invite"],
    desc: "Adds a member to the group",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isBotAdmins, senderNumber }) => {
    if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return await sendCustomMessage(conn, from, "❌ Only the bot owner can use this command.", mek, m);
    }
    if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to use this command.", mek, m);
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else if (q && /^\d+$/.test(q)) {
        number = q;
    } else {
        return await sendCustomMessage(conn, from, "❌ Please reply to a message, mention a user, or provide a number to add.", mek, m);
    }
    const jid = number + "@s.whatsapp.net";
    try {
        await conn.groupParticipantsUpdate(from, [jid], "add");
        await sendCustomMessage(conn, from, `✅ Successfully added @${number}`, mek, m);
    } catch (error) {
        console.error("Add command error:", error);
        await sendCustomMessage(conn, from, "❌ Failed to add the member.", mek, m);
    }
});


// ==========================
// Remove Member (Kick) Command
// ==========================
zandile({
    pattern: "remove",
    alias: ["kick", "k", "out"],
    desc: "Removes a member from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isBotAdmins, senderNumber }) => {
    if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) {
        return await sendCustomMessage(conn, from, "❌ Only the bot owner can use this command.", mek, m);
    }
    if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to use this command.", mek, m);
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        return await sendCustomMessage(conn, from, "❌ Please reply to a message or mention a user to remove.", mek, m);
    }
    const jid = number + "@s.whatsapp.net";
    try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        await sendCustomMessage(conn, from, `✅ Successfully removed @${number}`, mek, m);
    } catch (error) {
        console.error("Remove command error:", error);
        await sendCustomMessage(conn, from, "❌ Failed to remove the member.", mek, m);
    }
});

/*
// ==========================
// Promote Member Command
// ==========================
zandile({
    pattern: "promote",
    alias: ["p", "admin", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "🤴",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, senderNumber, botNumber, isAdmins, isBotAdmins }) => {
    if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
    if (!isAdmins) return await sendCustomMessage(conn, from, "❌ Only group admins can use this command.", mek, m);
    if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to use this command.", mek, m);
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        return await sendCustomMessage(conn, from, "❌ Please reply to a message or provide a number to promote.", mek, m);
    }
    if (number === botNumber) return await sendCustomMessage(conn, from, "❌ The bot cannot promote itself.", mek, m);
    const jid = number + "@s.whatsapp.net";
    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        await sendCustomMessage(conn, from, `✅ Successfully promoted @${number} to admin.`, mek, m);
    } catch (error) {
        console.error("Promote command error:", error);
        await sendCustomMessage(conn, from, "❌ Failed to promote the member.", mek, m);
    }
});


// ==========================
// Demote Admin Command
// ==========================
zandile({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "🙅‍♂",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, senderNumber, botNumber, isAdmins, isBotAdmins }) => {
    if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
    if (!isAdmins) return await sendCustomMessage(conn, from, "❌ Only group admins can use this command.", mek, m);
    if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to use this command.", mek, m);
    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0];
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, '');
    } else {
        return await sendCustomMessage(conn, from, "❌ Please reply to a message or provide a number to demote.", mek, m);
    }
    if (number === botNumber) return await sendCustomMessage(conn, from, "❌ The bot cannot demote itself.", mek, m);
    const jid = number + "@s.whatsapp.net";
    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        await sendCustomMessage(conn, from, `✅ Successfully demoted @${number} to a normal member.`, mek, m);
    } catch (error) {
        console.error("Demote command error:", error);
        await sendCustomMessage(conn, from, "❌ Failed to demote the member.", mek, m);
    }
});

*/
// ==========================
// Unmute Group Command
// ==========================
zandile({
    pattern: "unmute",
    alias: ["groupunmute","open","unlock"],
    react: "🔊",
    desc: "Unmute the group (Everyone can send messages).",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins }) => {
    try {
        if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
        if (!isAdmins) return await sendCustomMessage(conn, from, "❌ Only group admins can use this command.", mek, m);
        if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to unmute the group.", mek, m);
        await conn.groupSettingUpdate(from, "not_announcement");
        await sendCustomMessage(conn, from, "✅ Group has been unmuted. Everyone can send messages.", mek, m);
    } catch (e) {
        console.error("Error unmuting group:", e);
        await sendCustomMessage(conn, from, "❌ Failed to unmute the group. Please try again.", mek, m);
    }
});


// ==========================
// Close Group Immediately Command ("lockgc", "lock", "close")
// ==========================
zandile({
    pattern: "lockgc",
    alias: ["lock", "close", "mute","closegc"],
    react: "🔒",
    desc: "Immediately close the group chat (only admins can send messages).",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins }) => {
    try {
        if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
        if (!isAdmins) return await sendCustomMessage(conn, from, "❌ Only group admins can use this command.", mek, m);
        if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to close the group.", mek, m);
        // Immediately close group chat by updating settings to 'announcement'
        await conn.groupSettingUpdate(from, "announcement");
        await sendCustomMessage(conn, from, "✅ Group chat has been closed. Only admins can send messages.", mek, m);
    } catch (e) {
        console.error("Error closing group:", e);
        await sendCustomMessage(conn, from, "❌ Failed to close the group. Please try again.", mek, m);
    }
});

    
// ==========================
// Update Group Description Command
// ==========================
zandile({
    pattern: "updategdesc",
    alias: ["upgdesc", "gdesc"],
    react: "📜",
    desc: "Change the group description.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q }) => {
    try {
        if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
        if (!isAdmins) return await sendCustomMessage(conn, from, "❌ Only group admins can use this command.", mek, m);
        if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to update the group description.", mek, m);
        if (!q) return await sendCustomMessage(conn, from, "❌ Please provide a new group description.", mek, m);
        await conn.groupUpdateDescription(from, q);
        await sendCustomMessage(conn, from, "✅ Group description has been updated.", mek, m);
    } catch (e) {
        console.error("Error updating group description:", e);
        await sendCustomMessage(conn, from, "❌ Failed to update the group description. Please try again.", mek, m);
    }
});


// ==========================
// Update Group Name Command
// ==========================
zandile({
    pattern: "updategname",
    alias: ["upgname", "gname"],
    react: "📝",
    desc: "Change the group name.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, q }) => {
    try {
        if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
        if (!isAdmins) return await sendCustomMessage(conn, from, "❌ Only group admins can use this command.", mek, m);
        if (!isBotAdmins) return await sendCustomMessage(conn, from, "❌ I need to be an admin to update the group name.", mek, m);
        if (!q) return await sendCustomMessage(conn, from, "❌ Please provide a new group name.", mek, m);
        await conn.groupUpdateSubject(from, q);
        await sendCustomMessage(conn, from, `✅ Group name has been updated to: *${q}*`, mek, m);
    } catch (e) {
        console.error("Error updating group name:", e);
        await sendCustomMessage(conn, from, "❌ Failed to update the group name. Please try again.", mek, m);
    }
});


// ==========================
// Join Group via Invite Link Command
// ==========================
zandile({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isCreator, isDev, isOwner, isMe, args }) => {
    try {
        const msr = (await fetchJson('https://raw.githubusercontent.com/Joshuamambo1/ZANDILE-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
        if (!isCreator && !isDev && !isOwner && !isMe) return await sendCustomMessage(conn, from, msr.own_Joshuamambo1, mek, m);
        if (!q) return await sendCustomMessage(conn, from, "*Please write the Group Link*️ 🖇️", mek, m);
        let result = args[0].split('https://chat.whatsapp.com/')[1];
        await conn.groupAcceptInvite(result);
        await conn.sendMessage(from, { text: `✔️ *Successfully Joined*` }, { quoted: mek });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await sendCustomMessage(conn, from, `❌ *Error Occurred !!*\n\n${e}`, mek, m);
    }
});


// ==========================
// Get Group Invite Link Command
// ==========================
zandile({
    pattern: "invite",
    react: "🖇️",
    alias: ["grouplink", "glink"],
    desc: "To Get the Group Invite link",
    category: "group",
    use: '.invite',
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isDev, isBotAdmins }) => {
    try {
        const msr = (await fetchJson('https://raw.githubusercontent.com/Joshuamambo1/ZANDILE-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
        if (!isGroup) return await sendCustomMessage(conn, from, msr.only_gp, mek, m);
        if (!isAdmins && !isDev) return await sendCustomMessage(conn, from, msr.you_adm, mek, m);
        if (!isBotAdmins) return await sendCustomMessage(conn, from, msr.give_adm, mek, m);
        const code = await conn.groupInviteCode(from);
        await conn.sendMessage(from, { text: `🖇️ *Group Link*\n\nhttps://chat.whatsapp.com/${code}` }, { quoted: mek });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await sendCustomMessage(conn, from, `❌ *Error Occurred !!*\n\n${e}`, mek, m);
    }
});


// ==========================
// Reset (Revoke) Group Invite Link Command
// ==========================
zandile({
    pattern: "revoke",
    react: "🖇️",
    alias: ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
    desc: "To Reset the group link",
    category: "group",
    use: '.revoke',
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isDev, isBotAdmins }) => {
    try {
        const msr = (await fetchJson('https://raw.githubusercontent.com/Joshuamambo1/ZANDILE-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
        if (!isGroup) return await sendCustomMessage(conn, from, msr.only_gp, mek, m);
        if (!isAdmins && !isDev) return await sendCustomMessage(conn, from, msr.you_adm, mek, m);
        if (!isBotAdmins) return await sendCustomMessage(conn, from, msr.give_adm, mek, m);
        await conn.groupRevokeInvite(from);
        await conn.sendMessage(from, { text: `*Group link Reset* ⛔` }, { quoted: mek });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await sendCustomMessage(conn, from, `❌ *Error Occurred !!*\n\n${e}`, mek, m);
    }
});


// ==========================
// Hidetag (Tag All Members with Provided Message) Command
// ==========================
zandile({
    pattern: "hidetag",
    alias: ["htag"],
    react: "🔊",
    desc: "To Tag all Members for Message",
    category: "group",
    use: '.tag <message>',
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isDev, isBotAdmins, participants }) => {
    try {
        const msr = (await fetchJson('https://raw.githubusercontent.com/Joshuamambo1/ZANDILE-DATA/refs/heads/main/MSG/mreply.json')).replyMsg;
        if (!isGroup) return await sendCustomMessage(conn, from, msr.only_gp, mek, m);
        if (!isAdmins && !isDev) return await sendCustomMessage(conn, from, msr.you_adm, mek, m);
        if (!isBotAdmins) return await sendCustomMessage(conn, from, msr.give_adm, mek, m);
        if (!q) return await sendCustomMessage(conn, from, '*Please add a Message* ℹ️', mek, m);
        // Send the message with the provided text and mention all members
        await conn.sendMessage(from, { text: q, mentions: participants.map(a => a.id) }, { quoted: mek });
    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error(e);
        await sendCustomMessage(conn, from, `❌ *Error Occurred !!*\n\n${e}`, mek, m);
    }
});


// ==========================
// Tagall Command (Simplified Version)
// ==========================
zandile({
    pattern: "tagall",
    desc: "Tag all members with a heading and message content",
    category: "group",
    use: '.tagall <message>',
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, participants }) => {
    try {
        if (!isGroup) return await sendCustomMessage(conn, from, "❌ This command can only be used in groups.", mek, m);
        if (!q) return await sendCustomMessage(conn, from, "❌ Please provide a message to send.", mek, m);
        const header = "🔔 `Attention Everyone:`";
        const fullMsg = `${header}\n\n> ${q}\n\n© ZANDILE MK`;
        await conn.sendMessage(from, { text: fullMsg, mentions: participants.map(a => a.id) }, { quoted: mek });
    } catch(e) {
        await sendCustomMessage(conn, from, `❌ *Error Occurred!!* \n\n${e}`, mek, m);
    }
});


// ==========================
// Open Group by Time Command
// ==========================
zandile({
    pattern: "opentime",
    react: "🔑",
    desc: "To open group after a set time",
    category: "group",
    use: '.opentime <time> <unit>',
    filename: __filename
},
async (conn, mek, m, { from, prefix, l, args, q, isGroup, isAdmins, participants }) => {
    try {   
        if (!isGroup) return await sendCustomMessage(conn, from, ONLGROUP, mek, m);
        if (!isAdmins) return await sendCustomMessage(conn, from, ADMIN, mek, m);
        let timer;
        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return await sendCustomMessage(conn, from, '*select:*\nsecond\nminute\nhour\n\n*example*\n10 second', mek, m);
        }
        await sendCustomMessage(conn, from, `_Group will automatically open after ${q}_`, mek, m);
        setTimeout(async () => {
            const openMsg = "```🔓Good News! Group has been opened. Enjoy :)```" +
                            "\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ & ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ";
            await conn.groupSettingUpdate(from, 'not_announcement');
            await sendCustomMessage(conn, from, openMsg, mek, m);
        }, timer);
        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key } });
    } catch (e) {
        await sendCustomMessage(conn, from, '*Error !!*', mek, m);
        l(e);
    }
});


// ==========================
// Close Group by Time Command
// ==========================
zandile({
    pattern: "closetime",
    react: "🔒",
    desc: "To close group after a set time",
    category: "group",
    use: '.closetime <time> <unit>',
    filename: __filename
},
async (conn, mek, m, { from, prefix, l, args, q, isGroup, isAdmins, participants }) => {
    try {   
        if (!isGroup) return await sendCustomMessage(conn, from, ONLGROUP, mek, m);
        if (!isAdmins) return await sendCustomMessage(conn, from, ADMIN, mek, m);
        let timer;
        if (args[1] === 'second') {
            timer = args[0] * 1000;
        } else if (args[1] === 'minute') {
            timer = args[0] * 60000;
        } else if (args[1] === 'hour') {
            timer = args[0] * 3600000;
        } else if (args[1] === 'day') {
            timer = args[0] * 86400000;
        } else {
            return await sendCustomMessage(conn, from, '*select:*\nsecond\nminute\nhour\n\n*Example*\n10 second', mek, m);
        }
        await sendCustomMessage(conn, from, `_Group will be automatically closed after ${q}_`, mek, m);
        setTimeout(async () => {
            const closeMsg = "```🔐 Time's Up! Group auto closed.```" +
                             "\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ & ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ";
            await conn.groupSettingUpdate(from, 'announcement');
            await sendCustomMessage(conn, from, closeMsg, mek, m);
        }, timer);
        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key } });
    } catch (e) {
        await sendCustomMessage(conn, from, '*Error !!*', mek, m);
        l(e);
    }
});

// GINFO

zandile({
    pattern: "ginfo",
    react: "📌",
    alias: ["groupinfo"],
    desc: "Get detailed group information",
    category: "group",
    use: '.ginfo',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator ,isDev, isAdmins, reply}) => {
try{
const msr = (await fetchJson('https://raw.githubusercontent.com/Joshuamambo1/ZANDILE-DATA/refs/heads/main/MSG/mreply.json')).replyMsg

if (!isGroup) return reply(`*🌍 This command only works in groups!*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴢᴀɴᴅɪʟᴇ ᴍᴋ`)
if (!isAdmins) { if (!isDev) return reply(`*⚠️ You need to be admin to use this!*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴢᴀɴᴅɪʟᴇ ᴍᴋ`),{quoted:mek }} 
if (!isBotAdmins) return reply(`*🤖 Please make me admin first!*\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴢᴀɴᴅɪʟᴇ ᴍᴋ`)

const ppUrls = [
        'https://i.ibb.co/LhNYpW2J/midkingn3tkiinginnewyork.jpg',
        'https://i.ibb.co/LhNYpW2J/midkingn3tkiinginnewyork.jpg',
        'https://i.ibb.co/LhNYpW2J/midkingn3tkiinginnewyork.jpg',
      ];
let ppUrl = await conn.profilePictureUrl(from, 'image')
if (!ppUrl) { ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];}

const metadata = await conn.groupMetadata(from)
const groupAdmins = participants.filter(p => p.admin);
const listAdmin = groupAdmins.map((v, i) => `➤ @${v.id.split('@')[0]}`).join('\n');
const owner = metadata.owner

const gdata = `*━━━━━━━ GROUP INFO ━━━━━━━*

📛 *Name*: ${metadata.subject}
🆔 *JID*: ${metadata.id}
👥 *Members*: ${metadata.size}
👑 *Owner*: @${owner.split('@')[0]}
📝 *Description*: ${metadata.desc?.toString() || 'No description'}

*👮‍♂️ Admins List*:
${listAdmin}

*━━━━━━━━━━━━━━━━━━━*\n
> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴢᴀɴᴅɪʟᴇ ᴍᴋ`

await conn.sendMessage(from, {
    image: { url: ppUrl },
    caption: gdata,
    mentions: groupAdmins.map(a => a.id)
},{quoted:mek })

} catch (e) {
await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
console.log(e)
reply(`*❌ Error Occurred!*\n\n${e}\n\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴢᴀɴᴅɪʟᴇ ᴍᴋ`)
}
})

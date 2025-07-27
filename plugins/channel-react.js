const config = require('../settings');
const { zandile } = require('../zandile');

const stylizedChars = {
  a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
  h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
  o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
  v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
  '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
  '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

zandile({
  pattern: "channelreact",
  alias: ["creact", "chr"],
  react: "🔤",
  desc: "Stylized emoji reaction to channel messages",
  category: "owner",
  use: '.chr <channel-link> <text>',
  filename: __filename
}, async (conn, mek, m, {
  q, command, isCreator, reply
}) => {
  try {
    if (!isCreator) return reply("🚫 *Owner-only command*");

    if (!q) return reply(`⚠️ *Usage:*\n${command} https://whatsapp.com/channel/<id>/<msg-id> <text>`);

    const [link, ...textParts] = q.trim().split(' ');
    const inputText = textParts.join(' ').toLowerCase();

    if (!link.includes("whatsapp.com/channel/") || !inputText)
      return reply("❌ *Invalid link or missing text!*");

    const urlSegments = link.trim().split('/');
    const channelInvite = urlSegments[4];
    const messageId = urlSegments[5];

    if (!channelInvite || !messageId)
      return reply("❎ *Invalid channel/message ID in the link.*");

    // Stylize input text
    const emoji = inputText.split('').map(char => {
      if (char === ' ') return '―';
      return stylizedChars[char] || char;
    }).join('');

    // Get newsletter metadata using "newsletter" not "invite"
    const { id: channelJid, name: channelName } = await conn.newsletterMetadata("newsletter", channelInvite);

    // Send stylized reaction
    await conn.newsletterReactMessage(channelJid, messageId, emoji);

    return reply(
`╭━━〔  🫡ᴢᴀɴᴅɪʟᴇ ᴍᴋ ᴠ4.2.1👑☑ ⚡ 〕━⬣
┃✨ *Reaction sent successfully!*
┃📡 *Channel:* ${channelName}
┃💬 *Reaction:* ${emoji}
╰──────────────⬣
> 🔗 *Powered ©️ʙʏ ᴢᴀɴᴅɪʟᴇ ᴍᴋ ᴠ3❤☑* 🔥`
    );
  } catch (e) {
    console.error('channelreact error:', e);
    return reply(`⚠️ *Error:* ${e.message || "An unexpected error occurred."}`);
  }
});

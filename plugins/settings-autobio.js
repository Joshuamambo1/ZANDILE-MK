

const { zandile } = require('../zandile');
const config = require('../settings');

let bioInterval;
const defaultBio = "⚡ ZANDILE MK | Online 🕒 {time}";
const timeZone = 'Africa/Gweru';

zandile({
    pattern: "autobio",
    alias: ["autoabout"],
    desc: "Toggle automatic bio updates",
    category: "misc",
    filename: __filename,
    usage: `${config.PREFIX}autobio [on/off]`
}, async (conn, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ Only the bot owner can use this command");

    const [action, ...bioParts] = args;
    const customBio = bioParts.join(' ');

    try {
        if (action === 'on') {
            if (config.AUTO_BIO === "true") {
                return reply("ℹ️ Auto-bio is already enabled");
            }

            // Update config
            config.AUTO_BIO = "true";
            if (customBio) {
                // Store custom bio in memory only (not in env)
                config.AUTO_BIO_TEXT = customBio;
            } else {
                config.AUTO_BIO_TEXT = defaultBio;
            }

            // Start updating bio
            startAutoBio(conn, config.AUTO_BIO_TEXT);
            return reply(`✅ Auto-bio enabled\nCurrent text: "${config.AUTO_BIO_TEXT}"`);

        } else if (action === 'off') {
            if (config.AUTO_BIO !== "true") {
                return reply("ℹ️ Auto-bio is already disabled");
            }
            
            // Update config
            config.AUTO_BIO = "false";
            
            // Stop updating bio
            stopAutoBio();
            return reply("✅ Auto-bio disabled");

        } else {
            return reply(`Usage:\n` +
                `${config.PREFIX}autobio on [text] - Enable with optional custom text\n` +
                `${config.PREFIX}autobio off - Disable auto-bio\n\n` +
                `Available placeholders:\n` +
                `{time} - Current time\n` +
                `Current status: ${config.AUTO_BIO === "true" ? 'ON' : 'OFF'}\n` +
                `Current text: "${config.AUTO_BIO_TEXT || defaultBio}"`);
        }
    } catch (error) {
        console.error('Auto-bio error:', error);
        return reply("❌ Failed to update auto-bio settings");
    }
});

// Start auto-bio updates
function startAutoBio(conn, bioText) {
    stopAutoBio(); // Clear any existing interval
    
    bioInterval = setInterval(async () => {
        try {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { timeZone });
            const formattedBio = bioText.replace('{time}', timeString);
            await conn.updateProfileStatus(formattedBio);
        } catch (error) {
            console.error('Bio update error:', error);
            stopAutoBio();
        }
    }, 10 * 1000);
}

// Stop auto-bio updates
function stopAutoBio() {
    if (bioInterval) {
        clearInterval(bioInterval);
        bioInterval = null;
    }
}

// Initialize auto-bio if enabled in config
module.exports.init = (conn) => {
    if (config.AUTO_BIO === "true") {
        const bioText = config.AUTO_BIO_TEXT || defaultBio;
        startAutoBio(conn, bioText);
    }
};

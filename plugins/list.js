const {
	zandile,
	commands,
	mode
} = require("../lib/");
const config = require("../config");
zandile({
	pattern: 'list$',
	fromMe: mode,
	dontAddCommandList: true
}, async (message, match) => {
	let msg = ''
	let no = 1
	commands.map(async (command) => {
		if (command.dontAddCommandList === false && command.pattern !== undefined) {
			msg += `${no++}. ${command.pattern.toString().match(/(\W*)([A-Za-z0-9_ğüşiö ç]*)/)[2].trim()}\n${command.desc}\n\n`
		}
	})
	await message.reply(msg.trim())
})
zandile({
    pattern: 'help$',
    fromMe: mode,
    dontAddCommandList: true
}, async (message, match) => {
    try {
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();

        let msg = `\n╭━━━〔 ${config.BOT_NAME} 〕━━━┈
╭──────────────
❖ │  *OWNER*: ${config.OWNER_NAME}
❖ │  *MODE*: ${config.MODE}
❖ │  *DATE*: ${formattedDate}
❖ │  *TIME*: ${formattedTime}
╰──────────────
╰━━━━━━━━━━━━━━━┈\n\n`;

        commands.forEach(command => {
            if (!command.dontAddCommandList && command.pattern) {
                const patternMatch = String(command.pattern).match(/(\W*)([A-Za-z0-9_ğüşiö ç]*)/);
                if (patternMatch) {
                    msg += `❖ ${patternMatch[2].trim()}\n${command.desc}\n\n`;
                }
            }
        });

        let eypz = {
            key: {
                participant: "0@s.whatsapp.net",
                remoteJid: "120363221955276162@g.us"
            },
            message: {
                productMessage: {
                    product: {
                        productImage: {
                            mimetype: "image/jpeg",
                            jpegThumbnail: Buffer.alloc(0)
                        },
                        title: "Command List",
                        description: "List of available commands",
                        currencyCode: "USD",
                        priceAmount1000: "100000000000000",
                        retailerId: "Joshuamambo1",
                        productImageCount: 1
                    },
                    businessOwnerJid: "263738403205@s.whatsapp.net"
                }
            }
        };

        return await message.sendFromUrl(config.MENU_URL, {
            fileLength: "5555544444",
            gifPlayback: true,
            contextInfo: {
                externalAdReply: {
                    title: config.BOT_NAME,
                    body: config.OWNER_NAME,
                    sourceUrl: "https://github.com/Joshuamambo1/ZANDILE-MK",
                    mediaUrl: "https://tiktok.com",
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false,
                    thumbnailUrl: "https://files.catbox.moe/jog59s.jpg"
                }
            },
            caption: msg
        }, {
            quoted: eypz
        });

    } catch (error) {
        console.error('Error occurred:', error);
    }
});
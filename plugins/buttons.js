const axios = require('axios');
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, downloadContentFromMessage, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys')
const {zandile , commands} = require('../zandile')
//const prefix = config.PREFIX;


zandile({
    pattern: "button",
    react: "🦄",
    desc: "downlod song",
    category: "downlod",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{

let pan = `> MADE BY MR MIDKING 🤴`;
const url = "https://files.catbox.moe/qoqeoi.jpg"
async function image(url) {
  const { imageMessage } = await generateWAMessageContent({
    image: {
      url
    }
  }, {
    upload: conn.waUploadToServer
  });
  return imageMessage;
}
let msg = generateWAMessageFromContent(
  m.chat,
  {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: pan
          },
          carouselMessage: {
            cards: [
              {
                header: proto.Message.InteractiveMessage.Header.create({
          ...(await prepareWAMessageMedia({ image: { url: 'https://files.catbox.moe/qoqeoi.jpg' } }, { upload: conn.waUploadToServer })),
          title: ``,
          gifPlayback: true,
          subtitle: '©ᴊᴏsʜᴜᴀᴍᴀᴍʙᴏ𝟭 ᴛᴇᴄʜ',
          hasMediaAttachment: false
        }),
                body: {
                  text: ` BUTTON TEST`
                },
                nativeFlowMessage: {
                  buttons: [
                    {
      name: "quick_reply",
      buttonParamsJson: `{"display_text":"Menu",
      "id": ",menu"}`
             },
                    {
     name: "quick_reply",
     buttonParamsJson: `{"display_text":"Alive",
     "id": ",alive"}`
             },
             {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":" WhatsApp Channel ","url":"https://whatsapp.com/channel/0029VaraMtfFcowAKRdDdp1T"}`
                    },
                    {
                      name: "cta_url",
                      buttonParamsJson: `{"display_text":" Gitbub Repo ","url":"https://github.com/Joshuamambo1/ZANDILE-MK","merchant_url":"https://github.com/Joshuamambo1/ZANDILE-MK"}`
                    },
                  ],
                },
              },
            ],
            messageVersion: 1,
          },
        },
      },
    },
  },
  {}
);

await conn.relayMessage(msg.key.remoteJid, msg.message, {
  messageId: msg.key.id,
});

}catch(e){
console.log(e)
reply(`${e}`)
}
})

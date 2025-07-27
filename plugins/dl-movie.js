const { zandile } = require('../zandile');
const axios = require('axios');
const https = require('https');
const Config = require('../settings');

// Create custom HTTPS agent for the problematic API only
const insecureAgent = new https.Agent({  
  rejectUnauthorized: false // Only for this specific API
});

// Normal secure axios instance for other requests
const secureAxios = axios.create({
  timeout: 30000,
  httpsAgent: new https.Agent() // Default secure agent
});

// Insecure axios instance only for the movie API
const movieAxios = axios.create({
  timeout: 30000,
  httpsAgent: insecureAgent,
  maxContentLength: 200 * 1024 * 1024
});

malvin(
    {
        pattern: 'moviedl',
        alias: ['movie', 'film'],
        desc: 'Smart movie downloader with auto file/link',
        category: 'media',
        react: '🔍',
        use: '<movie title>',
        filename: __filename,
    },
    async (conn, mek, m, { text, reply }) => {
        try {
            if (!text) return reply(`🎬 *Usage:* ${Config.PREFIX}moviedl <movie title>\nExample: ${Config.PREFIX}moviedl ironman 2`);

            await conn.sendMessage(mek.chat, { react: { text: "⏳", key: mek.key } });

            // 1. Get movie metadata (using insecure agent only for this API)
            const apiUrl = `https://draculazyx-xyzdrac.hf.space/api/Movie?query=${encodeURIComponent(text)}`;
            const { data } = await movieAxios.get(apiUrl);
            
            if (!data?.download_link) {
                return reply('🎬 *Movie not found!* Try another title');
            }

            // 2. Prepare info message
            const yearMatch = data.title.match(/\((\d{4})\)/);
            const cleanTitle = data.title.replace(/\s*\|\s*Download.*$/, '').trim();
            const shortDesc = data.description ? 
                data.description.substring(0, 150) + (data.description.length > 150 ? '...' : '') : 
                'No description available';

            const infoMsg = `🎬 *${cleanTitle}* ${yearMatch ? `(${yearMatch[1]})` : ''}\n\n` +
                           `📝 ${shortDesc}\n\n` +
                           `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝔑3𝔱𝔎𝔦𝔫𝔤`;

            // 3. Check file size (using secure axios for the download link)
            let fileSizeMB;
            try {
                const headRes = await secureAxios.head(data.download_link);
                fileSizeMB = headRes.headers['content-length'] ? 
                    Math.round(headRes.headers['content-length'] / (1024 * 1024)) : null;
            } catch (e) {
                console.log('Size check failed, defaulting to link');
                fileSizeMB = null;
            }

            // 4. Send file or link based on size
            if (fileSizeMB && fileSizeMB <= 200) {
                try {
                    const response = await secureAxios.get(data.download_link, {
                        responseType: 'arraybuffer',
                        maxContentLength: 200 * 1024 * 1024
                    });

                    await conn.sendMessage(mek.chat, {
                        document: response.data,
                        fileName: `${cleanTitle.replace(/[^\w\s]/gi, '')}.mp4`,
                        mimetype: 'video/mp4',
                        caption: infoMsg
                    });
                } catch (downloadError) {
                    console.error('Download failed, falling back to link', downloadError);
                    await conn.sendMessage(mek.chat, {
                        text: infoMsg + `\n\n📥 *Download Link:* ${data.download_link}\n` +
                              `⚠️ *Couldn't send file directly*`
                    });
                }
            } else {
                await conn.sendMessage(mek.chat, {
                    text: infoMsg + `\n\n📥 *Download Link:* ${data.download_link}\n` +
                          `💡 *File too large for direct send*`
                });
            }

            await conn.sendMessage(mek.chat, { react: { text: "✅", key: mek.key } });

        } catch (error) {
            console.error('MovieDL Error:', error);
            await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
            reply('🎬 *Error:* ' + (error.message || 'Failed to process request'));
        }
    }
);

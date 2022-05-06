const ytdl = require('ytdl-core');

module.exports = async (video_url) => {
    var videoData
    try {
        videoData = await ytdl.getInfo(video_url, []);
    } catch (error){
        return { error }
    } finally {
        return ({ videoData })
    }   
};
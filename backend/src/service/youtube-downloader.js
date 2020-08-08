'use strict';

const ytdl = require('ytdl-core');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parseDateFromEpochToString(epochTimestamp)
{
  const publishedDate = new Date(epochTimestamp);
  return `${monthNames[publishedDate.getMonth()]} ${publishedDate.getDate()} ${publishedDate.getFullYear()}`;
}

function parseVideoThumbnailURL(videoID)
{
  return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
}

function parseVideoQualities(formats)
{
  // Filtering out only video formats with itags
  const firstPassFilteredQualities = formats.filter((element) => { return (element.container === "mp4" && element.qualityLabel !== null && element.audioBitrate !== null) });
  const secondPassFilteredQualities = firstPassFilteredQualities.sort((a, b) => { return b.bitrate - a.bitrate });
  const thirdPassFilteredQualities = secondPassFilteredQualities.map((element) => {
    
    return {
      id : element.itag,
      value : `${element.qualityLabel} ${Math.round(element.bitrate / 1000)} kbps`
    };

  });

  return thirdPassFilteredQualities;
}

module.exports = {

    verifyURL: async function(url)
    {
        try 
        {
            return ytdl.validateURL(url);
        }
        catch
        {
            throw new Error('Verifying process of URL failed');
        }
    },
    getVideoDetails: async function(url)
    {
        try
        {
            const isVerified = await this.verifyURL(url);
    
            if (isVerified)
            {
                const info = await ytdl.getInfo(url).catch(() => { throw new Error('Failed to retrieve video details') });

                return {

                    title:          info.title,
                    channelName:    info.author.name,
                    uploadDate:     parseDateFromEpochToString(info.published),
                    thumbnailURL:   parseVideoThumbnailURL(info.video_id),
                    qualityOptions: parseVideoQualities(info.formats),
                };
            }
        }
        catch (error)
        {
            throw error;
        }
    },
    createVideoDataStream: async function(url, qualityTag)
    {
        try
        {
            const info = await this.getVideoDetails();
            
            return {
                fileName: `${info.title}.mp4`,
                stream: ytdl(url, { quality: qualityTag }) 
            };
        }
        catch
        {
            throw new Error("Failed creating video stream")
        }
    }

}

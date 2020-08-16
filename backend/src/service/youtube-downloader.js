'use strict';

const ytdl = require('ytdl-core');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parseDateFromEpochToString(epochTimestamp)
{
  const publishedDate = new Date(epochTimestamp);
  return `${months[publishedDate.getMonth()]} ${publishedDate.getDate()} ${publishedDate.getFullYear()}`;
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
        catch(error)
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
                const info = await ytdl.getInfo(url, { filter: 'audioandvideo' });

                return {

                    title:          info.videoDetails.title,
                    channelName:    info.videoDetails.author.name,
                    uploadDate:     parseDateFromEpochToString(info.videoDetails.publishDate),
                    thumbnailURL:   parseVideoThumbnailURL(info.videoDetails.videoId),
                    qualityOptions: parseVideoQualities(info.formats),
                };
            }
        }
        catch(error)
        {
            throw new Error('Failed to retrieve video details');
        }
    },
    createVideoDataStream: async function(url, qualityTag)
    {
        try
        {
            const info = await this.getVideoDetails(url);
            
            return {
                fileName: `${info.title}.mp4`,
                stream: ytdl(url, { quality: qualityTag }) 
            };
        }
        catch(error)
        {
            throw new Error("Failed creating video stream")
        }
    }

}

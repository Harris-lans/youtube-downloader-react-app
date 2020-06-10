const functions = require('firebase-functions');
const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "./build/index.html"));
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
});
  
// Processing download request
app.get('/download-video', (req, res) => {

    const videoURL = req.query.videoURL;
    const qualityTag = req.query.qualityTag;

    ytdl.getInfo(videoURL).then((info) => {

        // Attaching header to the response
        res.header('Content-Disposition', `attachment; filename="${info.title}.mp4"`);

        // Using ytdl to pipe the download to the client
        ytdl(videoURL, { quality : qualityTag }).pipe(res);

        return null;

    }).catch((exception) => {

        res.send(`Failed to download video! Exception - ${exception}`);

    });

});

app.get('/verify-url', (req, res) => {

    const url = req.query.url;

    // Attaching the header to the response
    res.header('Validity');

    try 
    {
      // Querying the validity
      const response = { isValid : ytdl.validateURL(url) };

      // Attaching the json va
      res.json(response);

    } 
    catch (error)
    {
      res.send(`Failed to validate video! Exception - ${error}`);
    }
    
});

app.get('/video-details', (req, res) => {

    const url = req.query.url;

    // Attaching the header to the response
    res.header('Video-Details');

    // Getting required video details
    ytdl.getInfo(url).then((info) => {

        const data = {
          title:          info.title,
          channelName:    info.author.name,
          uploadDate:     parseDateFromEpochToString(info.published),
          thumbnailURL:      parseVideoThumbnailURL(info.video_id),
          qualityOptions: parseVideoQualities(info.formats),
        };

        // Attaching the json va
        res.json(data);

        return null;

    }).catch((exception)=>{

        res.send(`Failed to get video details! Exception - ${exception}`);

    });

});

exports.app = functions.runWith({ timeoutSeconds: 60, memory: '256MB' }).https.onRequest(app);
exports.verifyURL = functions.runWith({ timeoutSeconds: 60, memory: '256MB' }).https.onRequest(app);
exports.videoDetails = functions.runWith({ timeoutSeconds: 60, memory: '256MB' }).https.onRequest(app);
exports.downloadVideo = functions.runWith({ timeoutSeconds: 300, memory: '512MB' }).https.onRequest(app);

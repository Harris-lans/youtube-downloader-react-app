const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

// Utility imports
const path = require('path');
const port = 1300;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

app.listen(process.env.PORT || port, () => {

  console.log(`Server started at port ${process.env.PORT || port}`);

});

app.get('/', function (req, res) {

  console.log("Sent index.html file");
  res.sendFile(path.join(__dirname + "./build/index.html"));

});

// Processing download request
app.get('/download-video', function (req, res) {

  const videoURL = req.query.videoURL;

  // Attaching header to the response
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');

  // Using ytdl to pipe the download to the client
  ytdl(videoURL).pipe(res);

});

app.get('/verify-url', function (req, res) {

  const url = req.query.url;

  // Attaching the header to the response
  res.header('Validity');
  
  // Querying the validity
  const response = { isValid : ytdl.validateURL(url) };

  // Attaching the json va
  res.json(response);

});

app.get('/video-details', function (req, res) {

  const url = req.query.url;

  // Attaching the header to the response
  res.header('Video-Details');
  
  // Getting required video details
  ytdl.getInfo(url).then((info) => {

    const data = {
      title:          info.title,
      channelName:    info.author.name,
      uploadDate:     parseDateFromEpochToString(info.published),
      thumbnail:      parseVideoThumbnailURL(info.video_id),
      qualityOptions: parseVideoQualities(info.formats),
    };

    // Attaching the json va
    res.json(data);

  });

});

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
  const firstPassFilteredQualities = formats.filter((element) => { return (element.container === "mp4" && element.qualityLabel != null) });
  const secondPassFilteredQualities = firstPassFilteredQualities.sort((a, b) => { return b.bitrate - a.bitrate });
  const thirdPassFilteredQualities = secondPassFilteredQualities.map((element) => {
    
    return {
      id : element.itag,
      value : `${element.qualityLabel} ${Math.round(element.bitrate / 1000)} kbps`
    };

  });

  return thirdPassFilteredQualities;
}
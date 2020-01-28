const express = require('express');
const cors = require('cors'); 
const ytdl = require('ytdl-core');
const app = express();

// Utility imports
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'build')));
app.use(cors());

app.listen(process.env.PORT || 8080, () => {

  console.log(`Server started at port ${process.env.PORT || 8080}`);
});

// processing download request
app.get('/download', function (req, res) {
  
  var videoURL = req.query.video_url;

  console.log(videoURL);

  // attaching header to the response
  res.header('Content-Disposition', 'attachment; filename="video.mp4"');

  // using ytdl to pipe the download to the client
  ytdl(videoURL, { format : 'mp4' }).pipe(res);
});
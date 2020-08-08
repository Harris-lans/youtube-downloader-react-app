'use strict';

const path = require('path');
const config = require('../config');
const { youtubeDownloaderService } = require('../service');

module.exports = {

    getWebApp: async function (request, response, next) 
    {
        response.sendFile(config.FRONTEND_APPLICATION_PATH);
        response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    },
    verifyURL: async function (request, response, next) 
    {
        const isValid = await youtubeDownloaderService.verifyURL(request.query.url);
        response.status(200).json({ isValid });
    },
    getVideoDetails: async function (request, response, next) 
    {
        const videoDetails = await youtubeDownloaderService.getVideoDetails(request.query.url);
        response.status(200).json(videoDetails)
    },
    downloadVideo: async function (request, response, next) 
    {
        const { fileName, stream } = await youtubeDownloaderService.createVideoDataStream(request.query.url, request.query.quality_tag);
        response.header('Content-Disposition', `attachment; filename="${fileName}.mp4"`);
        stream.pipe(response); 
    }
};

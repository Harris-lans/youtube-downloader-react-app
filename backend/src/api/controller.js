'use strict';

const path = require('path');
const config = require('../config');
const { youtubeDownloaderService } = require('../service');

module.exports = {

    getWebApp: async function (request, response, next) 
    {
        try
        {
            response.sendFile(config.FRONTEND_APPLICATION_PATH);
            response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        }
        catch(error)
        {
            next(error);
        }
    },
    verifyURL: async function (request, response, next) 
    {
        try
        {
            const isValid = await youtubeDownloaderService.verifyURL(request.query.url);
            response.status(200).json({ isValid });
        }
        catch(error)
        {
            next(error);
        }
    },
    getVideoDetails: async function (request, response, next) 
    {
        try
        {
            const videoDetails = await youtubeDownloaderService.getVideoDetails(request.query.url);
            response.status(200).json(videoDetails);
        }
        catch(error)
        {
            next(error);
        }
    },
    downloadVideo: async function (request, response, next) 
    {
        try
        {
            const { fileName, stream } = await youtubeDownloaderService.createVideoDataStream(request.query.url, Number.parseInt(request.query.quality_tag));
            response.attachment(fileName);
            stream.pipe(response); 
        }
        catch(error)
        {
            next(error);
        }
    }
};

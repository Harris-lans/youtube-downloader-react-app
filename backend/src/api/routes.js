'use strict';

const controller = require('./controller'); 

module.exports = async function(app) 
{
    app.get('/', controller.getWebApp);

    app.get('/video/verification', controller.verifyURL);

    app.get('/video/details', controller.getVideoDetails);

    app.get('/video', controller.downloadVideo);
};

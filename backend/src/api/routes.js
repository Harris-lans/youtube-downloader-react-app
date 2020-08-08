'use strict';

const controller = require('./controller'); 

module.exports = async function(app) 
{
    app.get('/', controller.getWebApp);

    app.post('/video', controller.verifyURL);

    app.options('/video', controller.getVideoDetails);

    app.get('/video', controller.downloadVideo);
};

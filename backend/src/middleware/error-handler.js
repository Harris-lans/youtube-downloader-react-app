function errorHandler(error, request, response, next)
{
    response.status(500).json({

        error: {

            message: error.message,
            code: 500
        }

    });   
}

module.exports = errorHandler;

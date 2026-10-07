const errorHandler = (err, req, res, next) => {
    const {
        statusCode = 500,
        message = 'Something went wrong!'
    } = err;

    console.error(err);

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorHandler;
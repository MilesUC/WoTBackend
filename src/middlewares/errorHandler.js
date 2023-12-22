const errorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(err.statusCode)
    res.send({"error": err.message});
};

module.exports = errorHandler;
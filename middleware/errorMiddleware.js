<<<<<<< HEAD
//error MIddleware || NEXT Function
const errorMiddleware = (err, req, res, next) => {
    console.log(err)
    const defaultErrors = {
        statusCode: 500,
        message: err,
    }
    res.status(500).send({
        success: false,
        message: "Something Went Wrong",
        err,
    });
    //missing field error
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400
        defaultErrors.message = Object.values(err.errors).map(item => item.message).join(',')
    }

    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

=======
//error MIddleware || NEXT Function
const errorMiddleware = (err, req, res, next) => {
    console.log(err)
    const defaultErrors = {
        statusCode: 500,
        message: err,
    }
    res.status(500).send({
        success: false,
        message: "Something Went Wrong",
        err,
    });
    //missing field error
    if (err.name === 'ValidationError') {
        defaultErrors.statusCode = 400
        defaultErrors.message = Object.values(err.errors).map(item => item.message).join(',')
    }

    res.status(defaultErrors.statusCode).json({ message: defaultErrors.message });
};

>>>>>>> 5fa3c7bf8f7f043a19c8f6a65814234e3c6eb849
export default errorMiddleware;
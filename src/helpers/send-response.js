export default ({ res, status, data, message }) => {
    return res.status(status).json({
        data,
        error: null,
        message,
    });
};

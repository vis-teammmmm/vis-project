const fileService = require('../services/fileService');

exports.uploadFile = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }
    fileService.processFile(file, (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error processing file.', error: err });
        }
        res.status(200).send({ message: 'File processed successfully', data: result });
    });
};

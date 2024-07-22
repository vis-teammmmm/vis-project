exports.processFile = (file, callback) => {
    // Process file here
    // For example, parse a CSV, process an image, etc.
    console.log('Processing file:', file.path);
    callback(null, { status: 'success', filePath: file.path });
};

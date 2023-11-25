function Logging(filename, message, error = false)
{
    const date = new Date();
    const timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    const logLevel = error ? '[ERROR' : '[LOG';
    console.log(`${logLevel} | ${filename} | ${timestamp} ] ${message}`);
};


Logger = {
    log: (filename, message) => Logging(filename, message),
    error: (filename, message) => Logging(filename, message, error=true)
}
module.exports = Logger;
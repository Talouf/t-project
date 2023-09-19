let lastRequestTime = Date.now();
const requestDelay = 1000; // 1 second delay

const rateLimiter = (callback) => {
    const currentTime = Date.now();
    const timeDifference = currentTime - lastRequestTime;

    if (timeDifference < requestDelay) {
        setTimeout(() => {
            lastRequestTime = Date.now();
            callback();
        }, requestDelay - timeDifference);
    } else {
        lastRequestTime = Date.now();
        callback();
    }
};

module.exports = rateLimiter;
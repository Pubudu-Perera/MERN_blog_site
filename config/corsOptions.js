const allowedOrigins = require('./allowedOrigins');

// CORS configuration file
const corsOptions = {
    origin : (origin, callback) => {

        // !origin is for allowed server to server requests
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null,true);
        }else{
            callback(new Error("Not Allowed By CORS!"));
        }
    },
    credentials : true,
    optionSuccessStatus : 200
}

module.exports = corsOptions;

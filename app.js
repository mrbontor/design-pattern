const args = require('minimist')(process.argv.slice(2));
const bodyParser = require('body-parser')
const express = require('express')

const env = process.env.ENV || 'development'

const logging = require('./libs/logging')
const mongo = require('./libs/mongoDriver')
const app = express()

// Initialize config file
require('dotenv').config();

process.env.TZ = 'Asia/Jakarta'

// Initialize logging
logging.init({
    path: process.env.LOG_PATH,
    level: process.env.LOG_LEVEL,
    filename: process.env.LOG_FILENAME
})

let dataMongo = {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASS,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DB,
    interval: process.env.MONGO_INTERVAL
}

// Initialize mongo connection
mongo.init(dataMongo)
mongo.ping( (err, res) => {
    if (err) return logging.error(JSON.stringify(err.stack))

    if ( ! res.ok)
    return logging.error(`[MONGO] CONNECTION NOT ESTABLISHED. Ping Command not returned OK`)

    logging.debug(`[MONGO] CONNECTION ESTABLISHED`)
});

//setup CORS
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-access-token, Authorization');
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
    next();
};

//enable CORS
app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use( function(err, req, res, next) {
    if (err) {
        logging.error('[MIDDLEWAREERROR] ' + JSON.stringify(err));
        res.status(500);
        let response = {
            errors: [err.message]
        };
        res.json(response);
    } else {
        next();
    }
});


const {routes} = require('./router');
routes(app);


const port = process.env.PORT || 8000;
app.listen(port);
logging.info('[app] API-SERVICE STARTED on ' + port);

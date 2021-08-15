const fs = require('fs');
const logging = require(__dirname + '../../../../libs/logging');
const validate = require(__dirname + '../../../../libs/validateSchema');
const apiRequest = require(__dirname + '../../../../libs/request');
const db = require(__dirname + '../../../../libs/mongoPromise');

const _POST = JSON.parse(fs.readFileSync(__dirname + '/schema/post.json'))
const _PUT = JSON.parse(fs.readFileSync(__dirname + '/schema/post.json'))

const SUCCESS               = 200
const CREATED               = 201
const SUCCESS_NO_CONTENT    = 204
const BAD_REQUEST           = 400
const ACCESS_FORBIDDEN      = 403
const NOT_FOUND             = 404
const UNPROCESSABLE_ENTITY  = 422
const SERVER_ERROR        = 500

const USER_COLLECTION       = 'user'

const results = {}

const createData = async (req, res)  => {
    try {
        let isRequestValid = await validate(req.body, _POST)
        logging.debug(`[ISREQUESTVALID] >>>>> ${JSON.stringify(isRequestValid)}`)
        if (isRequestValid.length > 0) {
            results.error = 'ValidationError'
            results.errors = isRequestValid
            return res.status(BAD_REQUEST).send(results);
        }

        let store = await db.insertOne(USER_COLLECTION, isRequestValid)
        logging.debug(`[CREATE][POST] >>>>> ${JSON.stringify(store)}`)
        if (undefined === store.insertedId) {
            result.error = 'IncorectRequest'
            return res.status(BAD_REQUEST).send(result);
        }

        isRequestValid._id = store.insertedId;
        results.data = isRequestValid
        res.status(CREATED).send(results)
    } catch (e) {
        logging.error(`[CREATE][POST] >>>>> ${JSON.stringify(e.stack)}`)
        results.error = 'ServerError'
        res.status(SERVER_ERROR).send(results)
    }
}

const findData = async (req, res) => {
    try {
        let opt = {
            projection: {
                _id: 1,
                name: 1
            }
        }
        let find = await db.findAndOption(USER_COLLECTION, {}, opt)
        logging.debug(`[FIND][GET] >>>>> ${JSON.stringify(find)}`)
        results.data = find
        res.status(SUCCESS).send(results)
    } catch (e) {
        logging.error(`[CREATE][POST] >>>>> ${JSON.stringify(e.stack)}`)
        results.error = 'ServerError'
        res.status(SERVER_ERROR).send(results)
    }
}

const findDataBy = async (req, res) => {
    let ID = req.params.paramID ? req.params.paramID: null

    try {
        if(null === ID) return res.status(NOT_FOUND);

        let clause = { _id: db.newID(ID)}
        let find = await db.findBy(USER_COLLECTION, clause)
        logging.debug(`[FINDBY][GET] >>>>> ${JSON.stringify(find)}`)
        results.data = find
        res.status(SUCCESS).send(results)
    } catch (e) {
        logging.error(`[CREATE][POST] >>>>> ${JSON.stringify(e.stack)}`)
        results.error = 'ServerError'
        res.status(SERVER_ERROR).send(results)
    }
}

const updateData = async (req, res) => {
    let ID = req.params.paramID ? req.params.paramID: null

    try {
        if(null === ID) return res.status(NOT_FOUND);

        let isRequestValid = await validate(req.body, _PUT)
        logging.debug(`[ISREQUESTVALID] >>>>> ${JSON.stringify(isRequestValid)}`)
        if (isRequestValid.length > 0) {
            result.errors = isRequestValid
            return res.status(BAD_REQUEST).send(result);
        }

        let clause = { _id: db.newID(ID)}
        let dataUpdate = { $set: isRequestValid}
        let option = { upsert: false , returnNewDocument: true };

        let update = await db.findAndUpdate(USER_COLLECTION, clause, dataUpdate, option)
        logging.debug(`[UPDATE][PUT] >>>>> ${JSON.stringify(update)}`)
        results.data = update
        res.status(SUCCESS).send(results)
    } catch (e) {
        logging.error(`[UPDATE][POST] >>>>> ${JSON.stringify(e.stack)}`)
        results.error = 'ServerError'
        res.status(SERVER_ERROR).send(results)
    }
}

const deleteData = async (req, res) => {
    let ID = req.params.paramID ? req.params.paramID: null

    try {
        if(null === ID) return res.status(NOT_FOUND);

        let del = await db.findAndDelete(USER_COLLECTION, { _id: db.newID(ID)})
        logging.debug(`[DELETE][DELETE] >>>>> ${JSON.stringify(del)}`)

        res.status(SUCCESS_NO_CONTENT).send({})
    } catch (e) {
        logging.error(`[DELETE][POST] >>>>> ${JSON.stringify(e.stack)}`)
        results.error = 'ServerError'
        res.status(SERVER_ERROR).send(results)
    }
}


module.exports = {
    createData: createData,
    findData: findData,
    findDataBy: findDataBy,
    updateData: updateData,
    deleteData: deleteData
}

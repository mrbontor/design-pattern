const mongo = require(__dirname + '/mongoDriver')
const mongodb = require('mongodb')

function insertOne(collection, data) {
    return new Promise(function(resolve, reject){
        mongo.insertOne(collection, data, function(err, result){
            if(err) reject (err)
            resolve(result)
        })
    })
}

function updateOne(collection, clause, doc) {
    return new Promise(function(resolve, reject){
        mongo.updateOne(collection, clause, doc, function(err, result){
            if(err) reject(err)
            resolve(result)
        })
    })
}

function find(collection, data, options) {
    return new Promise(function(resolve, reject){
        mongo.find(collection, data, options, function(err, result){
            if(err) reject(err)
            resolve(result)
        })
    })
}

function findAndOption(collection, data, option) {
    return new Promise(function(resolve, reject){
        mongo.findOpt(collection, data, option, function(err, result){
            if(err) reject(err)
            resolve(result)
        })
    })
}

function findBy(collection, search) {
    return new Promise(function(resolve, reject){
        mongo.findOne(collection, search, function(err, result){
            if(err) reject(err)
            resolve(result)
        })
    })
}

function findAndUpdate(collection, clause, doc, options = {}) {
    return new Promise((resolve, reject) => {
        // options = { upsert: false, returnOriginal: false, returnNewDocument: true };
        mongo.findOneAndUpdate(collection, clause, doc, options, (err, result) => {
            if(err) reject(err);
            resolve(result.value);
        });
    });
}

function findAndDelete(collection, clause, options = {}) {
    return new Promise((resolve, reject) => {
        // options = { upsert: false, returnOriginal: false, returnNewDocument: true };
        mongo.findOneAndDelete(collection, clause, options, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

function deleteOne(collection, clause) {
    return new Promise(function(resolve, reject){
        mongo.deleteOne(collection, clause, function(err, result){
            if(err) reject(err)
            resolve(result)
        })
    })
}

function newID(id) {
    return new mongodb.ObjectId(id)
}

function dataTable(collection, options) {
    return new Promise(function(resolve, reject) {
        mongo.dataTable(collection, options, function (err, result){
            if(err) reject(err)
            resolve(result)
        })
    })
}

module.exports = {
    insertOne,
    updateOne,
    find,
    findAndOption,
    findBy,
    findAndUpdate,
    findAndDelete,
    deleteOne,
    newID,
    dataTable
}

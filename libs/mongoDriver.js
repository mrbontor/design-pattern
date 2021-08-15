const MongoDataTable = require('mongo-datatable');

class MongoDB {
    init(database) {
        this.MongoClient = require('mongodb').MongoClient;
        this.url = `mongodb://${database.user}:${database.password}@${database.host}/${database.database}?authSource=admin&w=majority&readPreference=primary&retryWrites=true`;
        // this.url = `mongodb+srv://password:username@localhost:27017/example?authSource=admin&w=majority&readPreference=primary&retryWrites=true&directConnection=true&ssl=false`;
        this.interval = database.interval || 5000;
        this.cachedDB = null;
        this.cacheClient = null;
    }

    connect(callback = null) {
        const self = this;
        if(this.cachedDB) {
            callback(this.cachedDB, this.cacheClient);
        } else {

            let options = {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }

            let self = this

            this.MongoClient.connect(this.url, options, function(err, client) {
                // assert.equal(null, err);
                if (err) return self.reconnect(callback)

                let db = client.db()
                self.cachedDB = db;
                self.cacheClient = client;

                if (callback) {
                    callback(db, client)
                }
            })
        }
    }

    reconnect(callback = null) {
        console.log('[DB][MONGODB] Reconnecting...')

        setTimeout(() => {
            this.connect(callback)
        }, this.interval)
    }

    find(collection, document, options = null, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).find(document, options).toArray(function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    findOpt(collection, document, options= null, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).find(document, options).toArray(function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    checkData(collection, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).find(document).sort({created: -1}).limit(1).toArray(function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    aggregate(collection, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).aggregate(document).toArray(function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    findOne(collection, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).findOne(document, (error, result) => {
                if (callback) {
                    callback(error, result)
                }

                client.close()

            })
        })
    }

    findOneAndUpdate(collection, clause, document, options, callback = null) {
        this.connect((db, client) => {
            db.collection(collection).findOneAndUpdate(clause, document, options, (err, result) => {

                if(callback) {
                    callback(err, result);
                }
                client.close()
            });
        });
    }

    findOneAndDelete(collection, clause, options, callback = null) {
        this.connect((db, client) => {
            db.collection(collection).findOneAndDelete(clause, options, (err, result) => {

                if(callback) {
                    callback(err, result);
                }
                client.close()
            });
        });
    }

    findLast(collection, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).find(document).sort({'_id':-1}).limit(1).toArray(function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    insertOne(collection, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).insertOne(document, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    insertMany(collection, document, option= {}, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).insertMany(document, option, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    updateOne(collection, clause, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).updateOne(clause, document, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    updateOneWithOpt(collection, clause, document, option = {}, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).updateOne(clause, document, option, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    updateMany(collection, clause, document, option = {}, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).updateMany(clause, document, option, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    removeFields(collection, clause, document, option, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).updateOne(clause, document, option, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    replaceOne(collection, clause, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).replaceOne(clause, document, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    deleteOne(collection, document, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).deleteOne(document, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    bulkWrite(collection, operation, option, callback = null) {
        this.connect(function(db, client) {
            db.collection(collection).bulkWrite(operation, option, function(err, results) {
                if (callback) {
                    callback(err, results)
                }

                client.close()
            })
        })
    }

    dataTable(collection, options, callback = null){
        this.connect(function(db, client) {

            let datatable = new MongoDataTable(db)
            datatable.get(collection, options, function(err, results) {

                console.log(results);
                if (callback) {
                    callback(err, results)
                }

                client.close()
            });
        })
    }

    ping( callback = null) {
        this.connect(function(db, client) {
            db.admin().ping((err, res) => {
                if (callback) {
                    callback(err, res)
                }
            })
        })
    }
}

module.exports = new MongoDB()

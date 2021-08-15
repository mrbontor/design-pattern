module.exports.routes = function(app) {
    const ACTIVE_VERSION = process.env.ACTIVE_VERSION || 1;

    const service = require(__dirname + `../../controllers/${ACTIVE_VERSION}/service-name`);

    /**
     * routes for service-name
     */


    app.route(`/api/${ACTIVE_VERSION}/service-name`)
        .post(service.createData)

    app.route(`/api/${ACTIVE_VERSION}/service-name`)
        .get(service.findData)

    app.route(`/api/${ACTIVE_VERSION}/service-name/:paramID`)
        .get(service.findDataBy)
        .put(service.updateData)
        .delete(service.deleteData)
}

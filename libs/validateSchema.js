const Ajv = require('ajv');

//show All error if data not valid
const ajv = new Ajv.default({
    allErrors: true,
    async: true,
    strict: false,
    // loopRequired: Infinity
}); // options can be passed, e.g. {allErrors: true}

async function isRequestValidated(request, type) {
    let valid = ajv.validate(type, request);
    if (!valid) {
        console.error(`[isRequestValidated] >>>> ${JSON.stringify(ajv.errors)}`)
        let result = await parseErrors(ajv.errors);

        return Promise.all(result);;
    }

    return request;
}

async function parseErrors(validationErrors) {
    let errors = [];
    validationErrors.forEach(error => {

        let err = error.message

        errors.push({
            param: error.params["missingProperty"] || error.params["additionalProperty"] || error.instancePath.slice(1),
            key: error.keyword,
            message: error.message,
            property: (function() {
                return error.keyword === 'minimum' ? error.dataPath : undefined
            })()
        });
    });
    return errors;
}

module.exports = isRequestValidated;

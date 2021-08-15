const Axios = require('axios')
const logging = require('./logging');

module.exports = {
    async doRequest(method, url, data = {}, options = {}) {

        let response = null
        try {
            const results = await httpRequest(method, url, data, options)
            logging.debug(`[HTTP REQUEST]${method.toUpperCase()} URL >>>> ${results.status} ${url}`)
            logging.debug(`[HTTP REQUEST]${method.toUpperCase()} STATUS >>>> ${JSON.stringify(results.statusText)}`)
            // logging.debug(`[HTTP REQUEST]${method.toUpperCase()} HEADERS >>>> ${JSON.stringify(results.headers)}`)
            logging.debug(`[HTTP REQUEST]${method.toUpperCase()} RESULT >>>> ${JSON.stringify(results.data)}`)

            return results
        } catch(err) {
            logging.error(`[HTTP REQUEST]${method.toUpperCase()} URL >>>> ${url}`)
            logging.error(`[HTTP REQUEST][ERROR]${method.toUpperCase()} STATUSCODE >>>> ${JSON.stringify(err.response.status)}`)
            // logging.error(`[HTTP REQUEST][ERROR]${method.toUpperCase()} HEADERS >>>> ${JSON.stringify(err.response.headers)}`)
            logging.error(`[HTTP REQUEST][ERROR]${method.toUpperCase()} RESULT >>>> ${JSON.stringify(err.response.data)}`)
            return {
                status: err.response.status,
                data: err.response.data
            }
        }
    },

    post(url, data, options) {
        return this.doRequest('post', url, data, options)
    },

    get(url, params, options) {
        return this.doRequest('get', url, params, options)
    },

    delete(url, params, options) {
        return this.doRequest('delete', url, params, options)
    },

    put(url, data, options) {
        return this.doRequest('put', url, data, options)
    },

    patch(url, data, options) {
        return this.doRequest('patch', url, data, options)
    }
}

const httpRequest = (method, url, data = {}, options = {}) => {
    const configs = {
        method: method,
        url: url,
        headers: options,
        maxRedirects: 5
    }
    if('get' === method) configs.params = data
    else configs.data = data

    return Axios(configs)
}

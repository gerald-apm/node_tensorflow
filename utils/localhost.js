const domain = process.env.DOMAIN || 'api.easeplantz.ml';
const hostname = process.env.NODE_ENV !== 'production' ?
    'localhost' : domain;

module.exports = hostname;

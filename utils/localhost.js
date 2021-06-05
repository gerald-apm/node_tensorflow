const hostname = process.env.NODE_ENV !== 'production' ?
    'localhost' : process.env.DOMAIN || 'api.easeplantz.ml';

module.exports = hostname;

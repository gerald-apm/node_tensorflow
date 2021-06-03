const hostname = process.env.NODE_ENV !== 'production' ?
    'localhost' : 'api.easeplantz.ml';

module.exports = hostname;

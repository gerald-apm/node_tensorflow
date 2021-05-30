const getIndexHandler = async (req, res) => {
    try {
        console.log('Test backend!');
        res.send({anu: 'hehe'});
    } catch (e) {
        console.log(e);
        return res.send('error');
    }
};

module.exports = getIndexHandler;

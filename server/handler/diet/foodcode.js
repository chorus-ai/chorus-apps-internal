const dietService = require('../../services/diet/foodcode');

exports.findByCode = (req, res) => {
    const { code } = req.params;

    dietService
        .findByCode(code)
        .then((result) => {
            if (result && result.dataValues) {
                res.send(result.dataValues);
            } else {
                res.status(404).send({
                    message: 'Not found',
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
}

exports.findByCodes = (req, res) => {
    const { codes } = req.body;

    dietService
        .findByCodes(codes)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
}

exports.search = (req, res) => {
    const { query } = req.params;

    dietService
        .search(query)
        .then((result) => {
            if (result && result.dataValues) {
                res.send(result.dataValues);
            } else {
                res.status(404).send({
                    message: 'Not found',
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};
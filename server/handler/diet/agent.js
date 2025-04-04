const agentService = require('../../services/diet/agent');

exports.agent = (req, res) => {
    const { messages } = req.body;
    const { uid, sid } = req.params; // user id and session id

    agentService
        .agent(messages)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message,
            });
        });
};
const m2dcommentService = require("../services/comment");
// const clients = require("../clients");

exports.findByModel = (req, res) => {
  const { mid, limit } = req.body;
  // console.log(parseInt(limit) - 10)
  m2dcommentService
    .findAll(limit, mid, null)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByProject = (req, res) => {
  const { pid, limit } = req.body;
  m2dcommentService
    .findAll(limit, null, pid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findByParentId = (req, res) => {
  const { cid, limit } = req.body;
  m2dcommentService
    .findByParentId(limit, cid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.findRepliesByUserId = (req, res) => {
  const { uid } = req.body;
  m2dcommentService
    .findRepliesByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.findByProjectByUserId = (req, res) => {
  const { uid } = req.body;
  m2dcommentService
    .findCommentsByProjectByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.findByModelByUserId = (req, res) => {
  const { uid } = req.body;
  m2dcommentService
    .findCommentsByModelByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.findAllByUserId = (req, res) => {
  const { uid } = req.body;

  m2dcommentService
    .findAllByUserId(uid)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = async (req, res) => {
  const { comment, replyTo, uid, mid, pid, imgs } = req.body;
  try {
    await m2dcommentService.create(comment, replyTo, uid, mid, pid, imgs);

    // if (replyTo !== -1) {
    //   const pcomment = await m2dcommentService.findById(replyTo)

    //   if (pcomment) {
    //     const ws = clients.getClient(pcomment.dataValues.User.dataValues.Id);
    //     if (ws) {
    //       ws.send("Someone replied to your comment!");
    //     }
    //   }
    // }
    res.send({ success: "ok" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.remove = async (req, res) => {
  const { cid } = req.body;
  try {
    await m2dcommentService.destroy(cid);
    res.send({ success: "ok" });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

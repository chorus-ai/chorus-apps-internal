const crcagendaService = require("../../services/crc/agenda");

exports.findByModuleId = (req, res) => {
  const { mid } = req.params;
  crcagendaService
    .findByModuleId(mid)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.findAllFormats = (req, res) => {
  crcagendaService
    .findAllFormats()
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

exports.update = async (req, res) => {
  const { contents } = req.body;
  const agendas = JSON.parse(contents);
  try {
    for (let i = 0; i < agendas.length; i++) {
      if (agendas[i].index != i) {
        await crcagendaService.update(agendas[i].id, i);
      }
    }
    res.send({ message: 'Successfully updated!' });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

}

exports.updateFormats = async (req, res) => {
  const { aid, contents } = req.body;
  const newData = JSON.parse(contents).map(item => {
    return {
      crcAgendaId: aid,
      crcFormatId: item,
    };
  });

  try {
    await crcagendaService.destroyAllFormats(aid);
    const newFormats = await crcagendaService.bulkCreateFormats(newData);
    res.send(newFormats);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateContents = async (req, res) => {
  const { aid, contents } = req.body;
  const newData = JSON.parse(contents).map(item => {
    return {
      content: item.content,
      index: item.index,
      crcAgendaId: aid,
    };
  });

  try {
    await crcagendaService.destroyAllContents(aid);
    const newContents = await crcagendaService.bulkCreateContents(newData);
    res.send(newContents);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateTitle = (req, res) => {
  const { aid, title } = req.body;
  crcagendaService
    .updateTitle(aid, title)
    .then(result => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.create = async (req, res) => {
  const { mid, index, title, formats, contents } = req.body;

  try {
    const agenda = await crcagendaService.create(mid, index, title);
    await crcagendaService.bulkCreateAgendaFormats(agenda.dataValues.id, JSON.parse(formats));
    

    const newContents = JSON.parse(contents).map(item => {
      return {
        content: item.content,
        index: item.index,
        crcAgendaId: agenda.dataValues.id,
      };
    });

    await crcagendaService.bulkCreateContents(newContents);

    const finalAgenda = await crcagendaService.findByAgendaId(agenda.dataValues.id);

    res.send(finalAgenda);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
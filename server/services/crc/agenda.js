const db = require("../../models");
const { Op } = require("sequelize");

exports.findByModuleId = (mid) => {
  return db.crcAgenda.findAll({
    attributes: ['id', 'title', 'index'],
    order: [
      ['index', 'ASC'],
      [db.crcAgendaContent, 'index', 'ASC']
    ],
    include: [
      {
        model: db.crcAgendaContent,
        attributes: ['id', 'content', 'index'],
      },
      {
        model: db.crcFormat,
        attributes: ['id', 'format'],
        through: {
          attributes: [],
        }
      }
    ],
    where: {
      crcModuleId: mid
    }
  });
};

exports.findByAgendaId = (aid) => {
  return db.crcAgenda.findOne({
    attributes: ['id', 'title', 'index'],
    include: [
      {
        model: db.crcAgendaContent,
        attributes: ['id', 'content', 'index'],
      },
      {
        model: db.crcFormat,
        attributes: ['id', 'format'],
        through: {
          attributes: [],
        }
      }
    ],
    where: {
      id: aid,
    }
  });
};

/**
 * Find all formats
 * @returns all formats
 */
exports.findAllFormats = () => {
  return db.crcFormat.findAll();
};

/**
 * Destroy all agenda formats
 * @param {Number} aid 
 * @returns 
 */
exports.destroyAllFormats = (aid) => {
  return db.crcAgendaFormat.destroy({
    where: {
      crcAgendaId: aid,
    }
  });
}

/**
 * Create formats
 * @param {List<Object>} formats 
 * @returns 
 */
exports.bulkCreateFormats = (formats) => {
  return db.crcAgendaFormat.bulkCreate(formats);
}

/**
 * distroy all agenda contents
 * @param {Number} aid 
 * @returns 
 */
exports.destroyAllContents = (aid) => {
  return db.crcAgendaContent.destroy({
    where: {
      crcAgendaId: aid,
    }
  });
};

/**
 * Create agenda contents
 * @param {List<Object>} contents 
 * @returns 
 */
exports.bulkCreateContents = (contents) => {
  return db.crcAgendaContent.bulkCreate(contents);
}

/**
 * update agenda title
 * @param {Number} aid 
 * @param {String} title 
 * @returns 
 */
exports.updateTitle = (aid, title) => {
  return db.crcAgenda.update({
    title: title
  }, {
    where: {
      id: aid,
    }
  });
};

exports.update = (aid, index) => {
  return db.crcAgenda.update({
    index: index
  }, {
    where: {
      id: aid,
    }
  });
};

exports.create = (mid, index, title) => {
  return db.crcAgenda.create({
    title: title,
    index: index,
    crcModuleId: mid,
  });
};

exports.bulkCreateAgendaFormats = (aid, formats) => {
  console.log(formats)
  return db.crcAgendaFormat.bulkCreate(
    formats.map(format => {
      return {
        crcAgendaId: aid,
        crcFormatId: format
      };
    })
  );
};
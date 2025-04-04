const db = require("../../models");
const { Op, Sequelize } = require("sequelize");

/**
 * @returns all foodcodes
 */
exports.findAll = () => {
  return db.dietFoodCode.findAll();
}

/**
 * @param {String} code
 * @returns foodcode
 */
exports.findByCode = (code) => {
  return db.dietFoodCode.findOne({
    where: {
      code: code,
    },
  });
}

/**
 * 
 * @param {List<String>} codes 
 * @returns food codes
 */
exports.findByCodes = (codes) => {
  return db.dietFoodCode.findAll({
    where: {
      code: {
        [Op.in]: codes,
      },
    },
  });
}

/**
 * @param {String} query
 * @returns foodcode
 */
exports.search = (query) => {
  return db.dietFoodCode.findAll({
    where: {
      [Op.or]: [
        {
          foodCode: {
            [Op.like]: `%${query}%`
          }
        },
        {
          description: {
            [Op.like]: `%${query}%`
          }
        },
        {
          details: {
            [Op.like]: `%${query}%`
          }
        }
      ]
    }
  })
};


module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'crcLectures',
        'transcript',
        {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'crcLectures',
        'note',
        {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'crcMultipleChoices',
        'explanation',
        {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('crcSlides');
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
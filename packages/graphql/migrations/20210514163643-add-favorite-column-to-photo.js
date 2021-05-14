'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      const transaction = await queryInterface.sequelize.transaction();
      try {
          await queryInterface.addColumn(
              'Photos',
              'favorite',
              {
                  type: Sequelize.DataTypes.BOOLEAN,
                  defaultValue: false,
                  allowNull: false
              },
              { transaction }
          );
          await transaction.commit();
      } catch (err) {
          await transaction.rollback();
          throw err;
      }
  },

  down: async (queryInterface, Sequelize) => {
      const transaction = await queryInterface.sequelize.transaction();
      try {
          await queryInterface.removeColumn('Photos', 'favorite', { transaction });
          await transaction.commit();
      } catch (err) {
          await transaction.rollback();
          throw err;
      }
  }
};

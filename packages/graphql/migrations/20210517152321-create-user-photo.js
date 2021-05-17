'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserPhotos', {
      userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
              model: {
                  tableName: 'Users',
              },
              key: 'id'
          }
      },
      photoId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
              model: {
                  tableName: 'Photos'
              },
              key: 'id'
          }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserPhotos');
  }
};

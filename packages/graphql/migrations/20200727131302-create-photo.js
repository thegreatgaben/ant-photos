'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Photos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            filename: {
                type: Sequelize.STRING
            },
            filepath: {
                type: Sequelize.STRING
            },
            filesize: {
                type: Sequelize.BIGINT
            },
            disk: {
                type: Sequelize.STRING
            },
            mimetype: {
                type: Sequelize.STRING
            },
            url: {
                type: Sequelize.STRING
            },
            caption: {
                type: Sequelize.STRING
            },
            albumId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: 'PhotoAlbums',
                    },
                    key: 'id',
                }
            },
            isCoverPhoto: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Photos');
    }
};

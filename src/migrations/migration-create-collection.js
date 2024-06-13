'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Collections', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            setFlashcardId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                      tableName: 'setflashcards'
                    },
                    key: 'id',
                },
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                      tableName: 'users'
                    },
                    key: 'id',
                },
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Collections');
    }
};
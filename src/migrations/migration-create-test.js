'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Tests', {
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
            time: {
                type: Sequelize.INTEGER
            },
            form: {
                type: Sequelize.STRING
            },
            quantity: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('Tests');
    }
};
'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Flashcards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            setFlashcardId: {
                type: Sequelize.DataTypes.INTEGER,
                references: {
                  model: {
                    tableName: 'setflashcards'
                  },
                  key: 'id',
                },
                allowNull: false,
            },
            identify: {
                type: Sequelize.STRING
            },
            terminology: {
                type: Sequelize.STRING
            },
            img: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('Flashcards');
    }
};
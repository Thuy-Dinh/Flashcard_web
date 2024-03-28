'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Similarflashcard extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Similarflashcard.init({
        userId: DataTypes.INTEGER,
        flashcardId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        topic: DataTypes.STRING,
        quantity: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Similarflashcard',
    });
    return Similarflashcard;
};
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Setflashcard extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Setflashcard.init({
        userId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        topic: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Setflashcard',
    });
    return Setflashcard;
};
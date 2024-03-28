'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Test extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Test.init({
        userId: DataTypes.INTEGER,
        flashcardId: DataTypes.INTEGER,
        time: DataTypes.INTEGER,
        form: DataTypes.STRING,
        quantity: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Test',
    });
    return Test;
};
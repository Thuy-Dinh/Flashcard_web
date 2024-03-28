'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'baothu2904@gmail.com',
      password: '1234567890',
      firstName: 'bao',
      lastName: 'thu',
      gender: 0,
      age: 18,
      img: '../public/add_test.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

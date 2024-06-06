module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Setflashcards', [
        {
          userId: 9,
          flashcardId: '1, 2, 3',
          title: 'Các loại tam giác',
          topic: 'Toán học',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Setflashcards', null, {});
    },
  };
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Flashcards', [
        {
            identify: 'Tam giác cân là tam giác có hai cạnh bằng nhau.',
            terminology: 'Tam giác cân',
            img: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            identify: 'Tam giác đều là tam giác có ba cạnh bằng nhau và ba góc bằng nhau.',
            terminology: 'Tam giác đều',
            img: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            identify: 'Tam giác vuông cân là một loại hình tam giác có ba cạnh và ba góc. Trong tam giác này, một trong ba góc của tam giác là góc vuông, tức là góc có độ lớn chính xác bằng 90 độ (π/2 radian). Đồng thời, tam giác này cũng có hai cạnh bằng nhau, tức là hai cạnh gần góc vuông là độ dài bằng nhau.',
            terminology: 'Tam giác vuông cân',
            img: '',
            createdAt: new Date(),
            updatedAt: new Date(),
        }
      ]);
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Flashcards', null, {});
    },
  };
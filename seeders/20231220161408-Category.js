'use strict';
/* eslint-disable no-unused-vars */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert('Categories', [
      { name: 'Electronics', createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Clothes and Apparels',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jewelry and Accessories',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { name: 'Pet Supplies', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Groceries', createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Food and Beverages',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { name: 'Automotive', createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Beauty and Personal Care',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Book and Stationery',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Home and Furniture',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Categories', null, {});
  }
};

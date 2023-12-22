'use strict';
const { Model } = require('sequelize');
/* eslint-disable no-unused-vars */
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    /* eslint-disable no-unused-vars */
    static associate(models) {
      // define association here
      //Product has many categories
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        as: 'category'
      });
    }
    /* eslint-disable no-unused-vars */
  }
  Product.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Product'
    }
  );
  return Product;
};

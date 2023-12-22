'use strict';
/* eslint-disable no-unused-vars */
const { Op } = require('sequelize');
const model = require('../models');
const verifyProductData =
  require('../middleware/post.validation').verifyProductData;

// POST method will be used to send properties via body
async function saveProduct(req, res) {
  const productData = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    categoryId: req.body.categoryId,
    userId: req.userAuth.userId
  };

  let { error } = verifyProductData(productData);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    //  check to see if the categoryId exists in db
    const hasValidCategory = await model.Category.findByPk(req.body.categoryId);
    if (!hasValidCategory) {
      return res.status(400).send('CategoryId not valid.');
    }
    const product = await model.Product.create(productData);
    const specificProduct = await model.Product.findByPk(product.id);

    return res.status(200).json({
      message: 'Product was created successfully',
      product: {
        productId: specificProduct.id,
        title: specificProduct.title,
        description: specificProduct.description,
        price: specificProduct.price,
        categoryId: specificProduct.categoryId // Fix: Use specificProduct.categoryId
      }
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}

// getSingleProduct will be used to get a product by Id
async function getSingleProduct(req, res) {
  const productId = req.params.productId;
  const validProduct = await model.Product.findOne({
    where: { id: productId, userId: req.userAuth.userId }
  });
  if (!validProduct) {
    return res.send({});
  }
  return res.status(200).send(validProduct);
}

// getAllProducts specific to a user(paginated)
async function getAllProducts(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10; // Default limit to 10 if not provided
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Default page to 1 if not provided
    const offset = (page - 1) * limit;

    const validProducts = await model.Product.findAndCountAll({
      where: {
        userId: req.userAuth.userId
      },
      limit,
      offset,
      order: [['price', 'DESC']] // Example: Sorting by price in descending order
    });

    if (!validProducts || validProducts.count === 0) {
      return res.status(200).json({});
    }

    const currentPage = page;
    const totalPages = Math.ceil(validProducts.count / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const previousPage = page > 1 ? page - 1 : null;

    res.status(200).json({
      products: validProducts.rows,
      totalProducts: validProducts.count,
      currentPage,
      totalPages,
      nextPage,
      previousPage
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//Edit a product data i.e title, description, category etc but not userId
async function editProduct(req, res) {
  try {
    const product = req.params.productId;
    const userProduct = await model.Product.findOne({
      where: {
        userId: req.userAuth.userId,
        id: product
      }
    });

    if (!userProduct) {
      return res.status(404).send({});
    }

    const updatedProduct = {
      title: req.body.title || userProduct.title,
      description: req.body.description || userProduct.description,
      price: req.body.price || userProduct.price,
      categoryId: req.body.categoryId || userProduct.categoryId,
      userId: req.userAuth.userId
    };

    const { error } = verifyProductData(updatedProduct); // This should always pass since i have defaults
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const [wasUpdated] = await model.Product.update(updatedProduct, {
      where: {
        userId: updatedProduct.userId,
        id: req.params.productId
      }
    });

    if (wasUpdated === 0) {
      return res.status(500).send('Product could not be updated');
    }

    const updatedProductFromDb = await model.Product.findOne({
      where: {
        userId: updatedProduct.userId,
        categoryId: updatedProduct.categoryId,
        id: req.params.productId
      }
    });

    return res.status(200).json({ product: updatedProductFromDb });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error ', error);
  }
}

// hard deletion from database
async function deleteProduct(req, res) {
  let productId = req.params.productId;

  try {
    // find if the product exist in dbs
    const userProduct = await model.Product.findOne({
      where: { id: productId, userId: req.userAuth.userId }
    });
    if (!userProduct) {
      return res.status(200).send({});
    }
    await model.Product.destroy({
      where: { id: productId, userId: req.userAuth.userId }
    })
      .then(res.status(200).send('product deleted'))
      .catch((err) => {
        res.status(400).send(err, ': Item could not be removed.');
      });
  } catch (err) {
    res.status(400).send(err, ': Item could not be removed.');
  }
}

async function filterProducts(req, res) {
  const searchTerm = req.query.searchTerm;
  const category = req.query.category;

  console.log('Search Term:', searchTerm);
  console.log('Category:', category);

  try {
    const filteredProducts = await model.Product.findAll({
      where: {
        userId: req.userAuth.userId,
        [Op.or]: [
          searchTerm && { title: { [Op.like]: `%${searchTerm}%` } },
          category && { '$Category.name$': { [Op.like]: `%${category}%` } }
        ].filter(Boolean) // Remove undefined elements
      },
      include: [{ model: model.Category, as: 'category' }],
      logging: console.log // Log the SQL query
    });

    res.status(200).json({ products: filteredProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  saveProduct,
  getSingleProduct,
  getAllProducts,
  editProduct,
  deleteProduct,
  filterProducts
};

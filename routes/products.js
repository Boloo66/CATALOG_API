const router = require('express').Router();
const productController = require('../controllers/product.controller');

router.post('/', productController.saveProduct);
router.get('/', productController.getAllProducts);
router.get('/filter', productController.filterProducts);
router.get('/:productId', productController.getSingleProduct);
router.patch('/:productId', productController.editProduct); // what if it ws get?
router.delete('/:productId', productController.deleteProduct); // what if it ws get?

module.exports = router;

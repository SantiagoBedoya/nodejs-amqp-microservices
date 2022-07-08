const { Router } = require('express');
const productController = require('../controllers/product.controller');
const isAuthenticated = require('../middlewares/is-authenticated.middleware');
const router = Router();

router.post('/', isAuthenticated, productController.create);
router.post('/buy', isAuthenticated, productController.buy);

module.exports = router;

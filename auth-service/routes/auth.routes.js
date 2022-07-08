const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const router = Router();

router.post('/auth/validate', authController.validate);
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

module.exports = router;

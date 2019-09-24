const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const adminController = require('../controllers/AdminController');
const userController = require('../controllers/UserController');
const productController = require('../controllers/ProductController');
const {
    check
} = require('express-validator');

router.post('/signup', [
    check('email').isEmail().withMessage('invalid email'),
    check('password').matches(/[0-9a-zA-Z@~!@#$%^&*()_+=|\]\-\[{}';/.,<>?":\\`]{8,}$/).withMessage('invalid password'),
    check('firstName').not().isEmpty().withMessage('firstName must not be empty'),
    check('lastName').not().isEmpty().withMessage('lastName must not be empty'),
], adminController.signup);

router.post('/login', [
    check('email').isEmail().withMessage('invalid email'),
    check('password').matches(/[0-9a-zA-Z@~!@#$%^&*()_+=|\]\-\[{}';/.,<>?":\\`]{8,}$/).withMessage('Invalid Password')
], adminController.login);

router.put('/user/:id', checkAuth, userController.updateUser);
router.delete('/user/:id', checkAuth, userController.deleteUser);

router.put('/product/:id', checkAuth, productController.updateProduct);
router.delete('/product/:id', checkAuth, productController.deleteProduct);

module.exports = router;
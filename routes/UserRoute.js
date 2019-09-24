const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
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
], userController.signup);

router.post('/login', [
    check('email').isEmail().withMessage('invalid email'),
    check('password').matches(/[0-9a-zA-Z@~!@#$%^&*()_+=|\]\-\[{}';/.,<>?":\\`]{8,}$/).withMessage('Invalid Password')
], userController.login);

router.get('/', checkAuth, userController.showAllUsers);

router.post('/product', [
    check('productName').not().isEmpty().withMessage('productName must not be empty'),
    check('manufacturerName').not().isEmpty().withMessage('manufacturerName must not be empty'),
    check('price').not().isEmpty().withMessage('price must not be empty'),
    check('user').not().isEmpty().withMessage('userId must not be empty')
], checkAuth, productController.addProduct);

module.exports = router;
const express = require('express');
const router = express.Router();
const dataLoader = require('../data/data-loader');
const { check, validationResult } = require('express-validator');

var cartItems = [];
var userLoggedIn = false;

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Online Book Store',
    categories: dataLoader.categories(),
    booksInCategories: dataLoader.booksInCategories(),
    cartSize: cartItems.length,
    userLoggedIn: userLoggedIn
  });
});

router.get('/login', (req, res) => {
  if (userLoggedIn) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'Online Book Store - Login',
      cartSize: cartItems.length
    });
  }
});

router.get('/reset-password', (req, res) => {
  if (userLoggedIn) {
    res.redirect('/');
  } else {
    res.render('reset-password', {
      title: 'Online Book Store - Reset Password',
      cartSize: cartItems.length
    });
  }
});

router.get('/logout', (req, res) => {
  userLoggedIn = false;
  res.redirect('/');
});

router.get('/books/:id', (req, res) => {
  let book = dataLoader.bookById(req.params.id);
  res.render('book-details', {
    title: 'Online Book Store - Book Details',
    book: book,
    cartSize: cartItems.length,
    userLoggedIn: userLoggedIn
  });
});

router.post('/books/:id', (req, res) => {
  let book = dataLoader.bookById(req.params.id);
  let bookQuantity = req.body.bookQuantity;
  if (bookQuantity) {
    cartItems.push({
      "bookId": book.id,
      "quantity": bookQuantity
    })
  }
  res.render('book-details', {
    title: 'Online Book Store - Book Details',
    book: book,
    cartSize: cartItems.length,
    userLoggedIn: userLoggedIn
  });
});

router.get('/carts/:bookId', (req, res) => {
  let book = dataLoader.bookById(req.params.bookId);
  let quantity = req.query.bookQuantity;
  if (quantity) {
    cartItems.push({
      "bookId": book.id,
      "quantity": quantity
    });
  }
  res.send({
    cartSize: cartItems.length,
    userLoggedIn: userLoggedIn
  });
});

router.post('/signin',
  [
    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter a email'),
    check('email')
      .isEmail()
      .withMessage('Please enter valid email'),
    check('password')
      .isLength({ min: 1 })
      .withMessage('Please enter password'),
  ],
  (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let user = dataLoader.getUser(email);
    if (user && user.email === email && user.password === password) {
      userLoggedIn = true;
      res.redirect('/');
    } else {
      res.render('login', {
        title: 'Online Book Store - Login',
        cartSize: cartItems.length,
        loginError: true
      });
    }
  });

router.post('/reset-password',
  [
    check('email')
      .isLength({ min: 1 })
      .withMessage('Please enter a email'),
    check('email')
      .isEmail()
      .withMessage('Please enter valid email'),
    check('oldPassword')
      .isLength({ min: 1 })
      .withMessage('Please enter old password'),
    check('newPassword')
      .isLength({ min: 1 })
      .withMessage('Please enter password'),
    check('repassword')
      .isLength({ min: 1 })
      .withMessage('Please enter reenter password'),
  ],
  (req, res) => {
    let email = req.body.email;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let repassword = req.body.repassword;
    if (newPassword !== repassword) {
      res.render('reset-password', {
        title: 'Online Book Store - Reset Password',
        cartSize: cartItems.length,
        resetError: true,
        errorMessage: 'Password and renter password not matching'
      });
    } else {
      let user = dataLoader.getUser(email);
      if (user && user.email === email && user.password === oldPassword) {
        let resetSuccess = dataLoader.updatePassword(email, repassword);
        res.render('reset-password', {
          title: 'Online Book Store - Reset Password',
          cartSize: cartItems.length,
          resetSuccess: resetSuccess
        });
      } else {
        res.render('reset-password', {
          title: 'Online Book Store - Reset Password',
          cartSize: cartItems.length,
          resetError: true,
          errorMessage: 'Unexpexted error. Contact Support'
        });
      }
    }
  });

module.exports = router;

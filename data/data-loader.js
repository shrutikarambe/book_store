const books = require('./books');
const users = require('./users');
const categories = require('./categories.json');
const inventory = require('./inventory.json');
const orders = require('./orders.json');
const booksInCategories = {};
const booksById = {};
books.forEach(book => {
    if (book.categories) {
        book.categories.forEach(category => {
            if (!booksInCategories[category]) {
                booksInCategories[category] = [];
            }
            book.shortDesc = book.description.substring(0, 50) + "...";
            booksInCategories[category].push(book);
        });
    }

    booksById[book.id] = book;
});

const userMap = {};
users.forEach(user => {
    userMap[user.email] = user;
});

function DataLoader() {
    return {
        books: function () {
            return books;
        },
        users: function () {
            return users;
        },
        categories: function () {
            return categories;
        },
        inventory: function () {
            return inventory;
        },
        orders: function () {
            return orders;
        },
        booksInCategories: function () {
            return booksInCategories;
        },
        bookById: function (id) {
            return booksById[id];
        },
        getUser: function (email) {
            return userMap[email];
        },
        updatePassword: function (email, newPassword) {
            userMap[email].password = newPassword;
            return true;
        }
    }
}

module.exports = new DataLoader();
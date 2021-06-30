'use strict';

const { 
  getBooks, 
  createBook, 
  deleteBooks, 
  getBook,
  createComment,
  deleteBook,
} = require('../controllers/controllers');

module.exports = function (app) {

  app.route('/api/books')
    .get(getBooks)    
    .post(createBook)        
    .delete(deleteBooks);

  app.route('/api/books/:id')
    .get(getBook)    
    .post(createComment)    
    .delete(deleteBook);
  
};

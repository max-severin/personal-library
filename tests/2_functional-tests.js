const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const testData = {
          title: '1984',
        };

        chai
          .request(server)
          .post('/api/books')
          .send(testData)
          .end(function (err, res) {
            assert.equal(res.status, 200);  

            assert.property(res.body, '_id');
            assert.isNotEmpty(res.body._id);

            assert.property(res.body, 'title');
            assert.equal(res.body.title, testData.title);

            specialBookId = res.body._id;

            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        const testData = {};

        chai
          .request(server)
          .post('/api/books')
          .send(testData)
          .end(function (err, res) {
            assert.equal(res.status, 200);  

            assert.equal(res.text, 'missing required field title');

            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);

            assert.isArray(res.body);

            res.body.forEach(function(book) {
              assert.property(book, '_id');
              assert.isString(book._id);

              assert.property(book, 'title');
              assert.isString(book.title);

              assert.property(book, 'comments');
              assert.isArray(book.comments);

              assert.property(book, 'commentcount');
              assert.isNumber(book.commentcount);
            });

            done();
        });      
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get('/api/books/invalidId')
          .end(function(err, res){
            assert.equal(res.status, 200);  

            assert.equal(res.text, 'no book exists');

            done();
        });      
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .get(`/api/books/${specialBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);

            assert.isObject(res.body);

            assert.property(res.body, '_id');
            assert.isString(res.body._id);

            assert.property(res.body, 'title');
            assert.isString(res.body.title);

            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);

            assert.property(res.body, 'commentcount');
            assert.isNumber(res.body.commentcount);

            done();
        });      
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const testData = {
          comment: 'Great',
        };

        chai
          .request(server)
          .post(`/api/books/${specialBookId}`)
          .send(testData)
          .end(function(err, res){
            assert.equal(res.status, 200);

            assert.isObject(res.body);

            assert.property(res.body, '_id');
            assert.isString(res.body._id);

            assert.property(res.body, 'title');
            assert.isString(res.body.title);

            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.include(res.body.comments, testData.comment);

            assert.property(res.body, 'commentcount');
            assert.isNumber(res.body.commentcount);

            done();
        });     
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        const testData = {};

        chai
          .request(server)
          .post(`/api/books/${specialBookId}`)
          .send(testData)
          .end(function(err, res){
            assert.equal(res.status, 200);  

            assert.equal(res.text, 'missing required field comment');

            done();
        });    
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const testData = {
          comment: 'Great',
        };

        chai
          .request(server)
          .post('/api/books/invalidId')
          .send(testData)
          .end(function(err, res){
            assert.equal(res.status, 200);  

            assert.equal(res.text, 'no book exists');

            done();
        });    
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete(`/api/books/${specialBookId}`)
          .end(function(err, res){
            assert.equal(res.status, 200);  

            assert.equal(res.text, 'delete successful');

            done();
        });
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        chai
          .request(server)
          .delete('/api/books/invalidId')
          .end(function(err, res){
            assert.equal(res.status, 200);  

            assert.equal(res.text, 'no book exists');

            done();
        });
      });

    });
    
    suite('DELETE /api/books => delete all books', function() {

      test('Test DELETE /api/books', function(done){
        chai
          .request(server)
          .delete('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);  

            assert.equal(res.text, 'complete delete successful');

            done();
        });
      });

    });

  });

});

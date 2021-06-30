'use strict';

const { ObjectId, bookModel } = require('../models/models');

const getBooks = async (req, res) => {
  try {
    const books = await bookModel.find();

    res.status(200).json(
      books.map((book) => ({
        _id: book._id,
        title: book.title,
        comments: book.comments,
        commentcount: book.comments.length,
      }))
    );
  } catch(error) {
    res.status(200).json({
      error,
      message: 'Server Error',
    });
  }
};

const createBook = async (req, res) => {
  let title = req.body.title;
  
  if (!title) {
    return res.status(200).send('missing required field title');
  }

  try {
    const book = new bookModel({
      title
    });

    await book.save();

    return res.status(200).json({
      _id: book._id,
      title: book.title,
    });
  } catch(error) {
    res.status(200).json({
      error,
      message: 'Server Error',
    });
  }
};

const deleteBooks = async (req, res) => {
  try {
    await bookModel.remove();

    return res.status(200).send('complete delete successful');
  } catch(error) {
    res.status(200).json({
      error,
      message: 'Server Error',
    });
  }
};

const getBook = async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await bookModel.findById(new ObjectId(_id));
  
    if (!book) {
      return res.status(200).send('no book exists');
    }

    res.status(200).json({
      _id: book._id,
      title: book.title,
      comments: book.comments,
      commentcount: book.comments.length,
    });
  } catch(error) {
    return res.status(200).send('no book exists');
  }
};

const createComment = async (req, res) => {
  const _id = req.params.id;
  const comment = req.body.comment;
  
  if (!comment) {
    return res.status(200).send('missing required field comment');
  }

  try {
    const book = await bookModel.findOneAndUpdate(
      { _id },
      { $push: { 
        comments: comment 
      }}, 
      { new: true }
    );
    
    if (!book) {
      return res.status(200).send('no book exists');
    }

    res.status(200).json({
      _id: book._id,
      title: book.title,
      comments: book.comments,
      commentcount: book.comments.length,
    });
  } catch(error) {
    return res.status(200).send('no book exists');
  }
};

const deleteBook = async (req, res) => {
  let _id = req.params.id;

  try {
    const book = await bookModel.findByIdAndDelete(new ObjectId(_id));
    
    if (!book) {
      return res.status(200).send('no book exists');
    }

    return res.status(200).send('delete successful');
  } catch(error) {
    return res.status(200).send('no book exists');
  }
};

module.exports = {
  getBooks,
  createBook,
  deleteBooks,
  getBook,
  createComment,
  deleteBook,
};

'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;
const { DB } = process.env;

(async () => {
  try {
    await mongoose.connect(
      DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
  } catch(error) {
    res.status(200).json({
      error,
      message: 'DB Error',
    });
  }
})();

const dbConnection = mongoose.connection;
dbConnection.on('error', () => console.error.bind(console, 'MongoDB Connection Error:'));
dbConnection.on('open', () => console.log('MongoDB Connection Established Successfully'));

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [{ 
    type: String, 
  }],
}, {
  timestamps: true,
});

const bookModel = mongoose.model('book', bookSchema);

module.exports = {
  ObjectId,
  bookModel,
};

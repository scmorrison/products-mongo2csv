var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var categoriesSchema = new Schema({
  name: {type: String, required: true, unique: true },
  code: {type: String, required: true, unique: true },
  active: {type: Boolean, default: true},
  creationDate: {type: Date, 'default': Date.now},
  openDate: Date,
  closeDate: Date,
  ancestors: [
      { _id: ObjectId,
        name: String,
        code: String
      }
  ],
  parent: String
});

module.exports = mongoose.model('categories', categoriesSchema);

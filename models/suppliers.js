var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var helper = require('../lib/custom');

var suppliersSchema = new Schema({
  code: { type: String, unique: true },
  name: { type: String, required: true, unique: true },
  active: {type: Boolean, default: true},
  creationDate: {type: Date, 'default': Date.now}
});


suppliersSchema.statics.insertIfNotExists = function ( supplierName, cb ) {
    this.find ( { 'name': supplierName } , function ( err, idSupplier, res ) {
        if (err) { throw err; }
        if (res.length == 0) {
            var s = { 'name': supplierName }
            var m = mongoose.model('suppliers', suppliersSchema);
            var sp = new m(s);
            console.log('1c');
            sp.save();
        }
        cb(err, sp._id, res);
    } ) ;
};

suppliersSchema.pre('save', function (next) {
  this.code = helper.slugify(this.name);
  next();
});

module.exports = mongoose.model('suppliers', suppliersSchema);
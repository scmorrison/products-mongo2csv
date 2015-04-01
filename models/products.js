var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , constants  = require('../config/constants')
  , defaultVAT = constants.defaultVAT;

var productsSchema = new Schema({
  id:               { type: Number, required: true, unique: true },
  name:             { type: String, required: true },
  _slug:            { type: String, unique: true }, //name + "-" + id
  supplier_ref  :   { type: String, required: true, unique: true },
  imageUrl:         { type: String, default:"" },
  id_trademark:     { type: ObjectId },
  _trademark:       { type: String },
  id_supplier :     { type: ObjectId },
  _supplier:        { type: String },
  ETPrice:          { type: Number },
  ETPrice_eur:      { type: Number },
  ETPrice_dol:      { type: Number },
  price:            { type: Number },
  price_eur:        { type: Number },
  price_dol:        { type: Number },
  active:           { type:Boolean, 'default':true},
  _visible:         { type:Boolean, 'default':false},
  displayOrder:     { type: Number, 'default': 99 },
  whatami: {
    _universe_code:   { type:String},
    _family_code:     { type:String},
    _subfamily_code:  { type:String}
  },
  slugMenus:        [String],
  creationDate:     { type: Date, default: Date.now},
  _qty:             { type: Number, default:0 },
  specific: {
    custom_family_code:       { type: String },
    custom_family_name:       { type: String },
    custom_subfamily_code:    { type: String },
    custom_subfamily_name:    { type: String },
    custom_status:            { type: String },
    custom_visible:           { type: Boolean, default:true },
    custom_text1:             { type: String },
    custom_text2:             { type: String },
    custom_text3:             { type: String },
    custom_man:               { type: Boolean, 'default':false },
    custom_woman:             { type: Boolean, 'default':false }
  },
  details: {
    description:     { type: String},
    description_en:  { type: String},
    material:        { type: String},
    images:          [String],
    isnew:           { type: Boolean, 'default': false }
  },
  variation: [ {
    color:      String,
    size:       String,
    qty:        {type: Number, default:0 }
  }],
  carted: [ { 
    qty:            Number, 
    id_cart:        ObjectId,
    id_variation:   ObjectId,
    timestamp:      {type: Date, default: Date.now}
 } ]
});

productsSchema.statics.searchBySupplierRef = function ( supplier_ref, cb ) {
    this.find ( { 'supplier_ref': supplier_ref } , cb ) ;
};

productsSchema.statics.updateSupplier = function (supplierId, supplierName) {
    var query = { id_supplier: supplierId };
    this.update(query, { _supplier: supplierName }, { multi: true }, function(err) {
        if (err) { throw err; }
    });
};

productsSchema.statics.updateTrademark = function (trademarkId, trademarkName) {
    var query = { id_trademark: trademarkId };
    this.update(query, { _trademark: trademarkName }, { multi: true }, function(err) {
        if (err) { throw err; }
    });
};

module.exports = mongoose.model('products', productsSchema);

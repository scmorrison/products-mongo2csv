var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var configurationSchema = new Schema({
  countries: [
    {
      name: {type: String, required: true, unique: true },
      ISOCountryCode: String,
      VAT: {type: Number, required: true },
      acceptsShipping: {type: Boolean, default: true},
      carriers: [carrierSchema]
    }
  ],
  carriers: [
    {
      name: String,
      url: String, 
      active: Boolean,
      deliveryDelay: Number
    }
  ],
  caddy: {
    expirationDelay: Number
  },
  name: String,
  defaultVAT: Number
});

var carrierSchema = new Schema({
      id_carrier: ObjectId,
      _carrierName: String,
      active: Boolean,
      deliveryPrice_eur: Number,
      deliveryPrice_dol: Number,
      free: {type: Boolean },
      priceLimit: {type: Boolean },
      freePriceLimit: {
          eur: Number,
          dol: Number
      }
    });

module.exports = mongoose.model('configuration', configurationSchema);

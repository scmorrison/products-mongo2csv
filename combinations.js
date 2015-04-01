"use strict"

//var json2csv = require('json2csv')
var json2csv = require('nice-json2csv');
var _ = require('lodash')
var mongoose = require('mongoose')
var Promise = require('bluebird')
var products = require('./models/products.js')
Promise.promisifyAll(products)
Promise.promisifyAll(products.prototype)

mongoose.connect('mongodb://localhost/mexicana')

var using = Promise.using;

var addSlashes = function(string) {
  return string.replace(/\\/g, '\\\\').
  replace(/\t/g, '\\t').
  replace(/\n/g, '\\n').
  replace(/\f/g, '\\f').
  replace(/\r/g, '\\r').
  replace(/'/g, '\\\'').
  replace(/"/g, '\\"');
}

var json2csvCallback = function(err, csv) {
  if (err) throw err;
  return csv;
};

var generateCsvLine = function(product, cb) {
  var line = {}
  line['id'] = product.id
  line['option'] = "Taille:"+product.combo.size
  line['val'] = product.combo.size.split(" ")[0]
  line['attrib'] = "Taille:size"
  line['qty'] = product.combo.qty
  //line['image'] = _.chain(product.details.images).first().value().replace(/\/photos/g, 'http://www.mexicana.fr/photos')
  /*line['image'] = product.details.images.map(function(image) {
    return image.replace(/\/photos/g, 'http://www.mexicana.fr/photos')
  }).join(',')*/

  //var csv = converter.json2csv(product, json2csvCallback)
  return line
}

var fields = 'id variation details.images'
var field_names = [
  '"ID"',
  '"Option"',
  '"Value (Value:Position)"',
  '"Attribute (Name:Type:position)"',
  '"Quantity"'
  //'"Image URL"'
]

products.find({}, fields).sort('id')
  .then(function(products) {
    //console.log(products)
    return products
  })
  .then(function(products) {
    var normalized = []
    var id = 1
    products.map(function(product) {
      //product.ID = id
      product.variation.map(function(combo) {
        var prod = product
        prod['combo'] = combo
        var line = generateCsvLine(prod)
        normalized.push(line)
      })
    })
    return normalized
  })
  .then(function(products) {
    var csvContent = field_names.join(',') + '\n'
    csvContent += json2csv.convert(products, '', true)
    console.log(csvContent)
    return csvContent
  })
  .catch(function(err) {
    console.error(err)
  })

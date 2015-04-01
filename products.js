"use strict"

var json2csv = require('nice-json2csv');

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
  line['name'] = product.name
  line['price_w_tax'] = product.ETPrice_eur
  line['price_wo_tax'] = product.price_eur
  line['supplier'] = product._supplier
  line['manufacturer'] = product._trademark
  line['description'] = product.details.description.replace(/\n/g, '<br/>') //addSlashes(product.details.description.replace(/\n/g, '<br/>'))

  var image_urls = product.details.images.map(function(image) {
    return image.replace(/\/photos/g, 'http://www.mexicana.fr/photos')
  })

  // Swap image 1 with image 2
  var x = 0, y = 1
  image_urls[x] = image_urls.splice(y, 1, image_urls[x])[0]
  line['image_urls'] = image_urls.join(',')
  return line
}

var fields = 'id name ETPrice_eur price_eur _supplier _trademark details.description details.images'
var field_names = [
  '"ID"',
  '"Name"',
  '"Price tax excluded"',
  '"Price tax included"',
  '"Supplier"',
  '"Manufacturer"',
  '"Description"',
  '"Image URLs (x,y,z...)"'
]

products.find({}, fields).sort('id').limit(10)
  .then(function(products) {
    //console.log(products)
    return products
  })
  .then(function(products) {
    var normalized = []
    var id = 1
    products.map(function(product) {
      //product.ID = id
      var line = generateCsvLine(product)
      normalized.push(line)
      id++
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


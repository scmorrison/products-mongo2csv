var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.connection;
autoIncrement.initialize(connection);


var Configuration    = require('../models/configuration');
var menus = require('../models/menus');
var families = require('../models/families');

exports.slugify = function(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
};

// family helpers
exports.get_ancestors = function(parent_id, ancestors_list, cb) {
    console.log("enter get_ancestors");
    families.findOne( {_id: parent_id}, {ancestors:0}, function(err, family) {
        if (err) { return cb(err); }
        if (family) {
            var currFamily = {
                _id_ancestor: family._id,
                _slug: family.slug,
                name: family.name };
            ancestors_list.push(currFamily);
            if (family.parent != null) {
                exports.get_ancestors(family.parent, ancestors_list, cb);
            } else {
                cb(ancestors_list);
            }
        } else {
            cb(ancestors_list);
        }
    });
};

exports.update_descendant = function(id, cb) {
    console.log("enter update_descendant");
    families.find(
        {"ancestors._id_ancestor": id},
        {parent: 1},
        function(err, descendants){
            var index;
            for (index = 0; index < descendants.length; ++index) {
                console.log(descendants[index]);
                exports.global_ancestors(descendants[index]._id, descendants[index].parent, function(err, nb, raw) {
                    //console.log(nb + " descendants updated!");
                });
            }
        });
};

exports.global_ancestors = function(id, parent_id, cb) {
    var ancestors = new Array();
    exports.get_ancestors(parent_id, ancestors, function(err) {
        families.findOneAndUpdate(
                {_id: id},
                {$set: {ancestors: ancestors} },
                function(err, nb, raw) {
                    if (err) { throw err; }
                    console.log("Descendant updated!");
                    cb(err, nb, raw);
                });
    });
};

// menus helpers
exports.get_menu_ancestors = function(parent_id, ancestors_list, cb) {
    console.log("enter get_ancestors");
    menus.findOne( {_id: parent_id}, {ancestors:0}, function(err, menu) {
        if (err) { return cb(err); }
        if (menu) {
            var currMenu = {
                _id_ancestor: menu._id,
                _slug: menu.slug,
                name: menu.name };
            ancestors_list.push(currMenu);
            if (menu.parent != null) {
                exports.get_menu_ancestors(menu.parent, ancestors_list, cb);
            } else {
                cb(ancestors_list);
            }
        } else {
            cb(ancestors_list);
        }
    });
};

exports.update_menu_descendant = function(id, cb) {
    console.log("enter update_descendant");
    menus.find(
        {"ancestors._id_ancestor": id},
        {parent: 1},
        function(err, descendants){
            var index;
            for (index = 0; index < descendants.length; ++index) {
                console.log(descendants[index]);
                exports.global_menu_ancestors(descendants[index]._id, descendants[index].parent, function(err, nb, raw) {
                    //console.log(nb + " descendants updated!");
                });
            }
        });
};

exports.global_menu_ancestors = function(id, parent_id, cb) {
    var ancestors = new Array();
    exports.get_menu_ancestors(parent_id, ancestors, function(err) {
        menus.findOneAndUpdate(
                {_id: id},
                {$set: {ancestors: ancestors} },
                function(err, nb, raw) {
                    if (err) { throw err; }
                    console.log("Descendant updated!");
                    cb(err, nb, raw);
                });
    });
};

exports.getConfiguration = function(cb) {
    
    var tmpConfig = Configuration
                   .find ( {} )
                   .exec ( function (err, c) {
                        if (err) { throw err }
                        //return c;
                        cb (c);
                    } );
    
    //cb (tmpConfig);
};

exports.getDefaultVAT = function( cb ) {
    
    var tmpConfig = Configuration.find ( {} ).exec ( function (err, c) {
        if (err) { throw err }
        cb ( c[0].defaultVAT );
    } );
};

// Returns ET price 
// VAT is 20 if if is 20%
exports.toET = function ( ATIPrice, VAT ) {
    if ( (ATIPrice != undefined) && (VAT != undefined) ) {
        if (VAT == 0) 
           return ATIPrice 
        else
            return Math.round( ATIPrice * 100 * 100 /( 100+VAT )) / 100;
    } else 
        return undefined;
    
};

exports.toATI = function ( ETPrice, VAT ) {
    if ( (ETPrice != undefined) && (VAT != undefined) ) {
        if (VAT == 0) 
           return ETPrice 
        else
            return Math.round( ETPrice * 100 * (100+VAT)/100) / 100;
    } else 
        return undefined;
    
};

// dedupe array
exports.dedupe = function(arrayToDedup, hasher) {
    hasher = hasher || JSON.stringify;

    var clone = [];
    var lookup = {};

    for(var i = 0; i < arrayToDedup.length; i++) {
        var elem = arrayToDedup[i];
        var hashed = hasher(elem);

        if(!lookup[hashed]) {
            clone.push(elem);
            lookup[hashed] = true;
        }
    }

    return clone;
}

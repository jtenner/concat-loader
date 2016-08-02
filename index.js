var qs = require('querystring');
var glob = require('glob');
var async = require('async');
var fs = require('fs');

module.exports = function(entry) {
  var cb = this.async();
  this.cacheable();
  var opts = qs.parse(this.query.slice(1));

  if (!opts.glob) {
    return cb(new Error('No glob specified for resource ' + this.resourcePath + '.'));
  }


  glob(opts.glob, {}, function(err, matches) {
    if (!err) {
      async.map(matches, fs.readFile, function(rfErr, results) {
        if (!rfErr) {
          var source = (opts.prepend ? results.concat([entry]) : [entry].concat(results)).join('\n');
          return cb(null, source);
        } else {
          return cb(rfErr);
        }
      });
    } else {
      return cb(err);
    }
  });
};

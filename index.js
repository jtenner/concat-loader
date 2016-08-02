var qs = require('querystring');
var glob = require('glob');
var async = require('async');
var fs = require('fs');

module.exports = function(entry) {
  var cb = this.async();
  this.cacheable();
  var opts = qs.parse(this.query.slice(1));

  if (!opts.glob) {
    cb(new Error('No glob specified for resource ' + this.resourcePath + '.'));
  }

  glob(opts.glob, {}, function(err, matches) {
    if (!err) {
      async.map(matches, fs.readFile, function(rfErr, results) {
        if (!rfErr) {
          var source = [entry].concat(results).join('\n');
          cb(null, source);
        } else {
          cb(rfErr);
        }
      });
    } else {
      return cb(err);
    }
  });
};

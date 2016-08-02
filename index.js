var qs = require('querystring');
var glob = require('glob');
var async = require('async');
var fs = require('fs');

module.exports = function(entry) {
  var cb = this.async();
  this.cacheable();
  var opts = qs.parse(this.query);
  if (!opts.hasOwnProperty('glob') || !opts.glob) {
    cb(new Error('No glob specified for resource ' + this.resourcePath + '.'));
  }

  glob(opts.glob, {}, function(err, matches) {
    if (!err) {
      async.map(matches, fs.readFile, function(rfErr, results) {
        if (!rfErr) {
          cb([entry].concat(results).join('\n'));
        } else {
          cb(rfErr);
        }
      });
    } else {
      return cb(err);
    }
  });
};

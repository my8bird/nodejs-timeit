// File that is copied into README.md to show example code
// The output of running this file is the also the example output

var timeit = require('./timeit'),
    iterations = 30000;

function use_concat(done) {
   var a = 'a string',
       b = a.concat('stuck together');
   done();
}

function use_plus(done) {
   var a = 'a string',
       b = a + 'stuck together';
   done();
}

timeit.setBaseline(function(err, baseline_values) { // Get a baseline to compare against
   timeit.howlong(iterations, [use_concat, use_plus], function(err, results) {
      console.log('Concat speed', results[0]);
      console.log('Using Plus speed', results[1]);
   });
});

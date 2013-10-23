[![Build Status](https://secure.travis-ci.org/my8bird/nodejs-timeit.png?branch=master)](http://travis-ci.org/my8bird/nodejs-timeit)


Provide a simple interface for testing how fast different methods are.

Installation
============
    npm install timeit
    or
    git clone git@github.com:my8bird/nodejs-timeit.git
    npm install


Usage
=====

Test one method
---------------
```javascript
var timeit = require('./timeit'),
    iterations = 30000;

function use_concat(done) {
    var a = 'a string',
        b = a.concat('stuck together');
    done();
}

timeit.howlong(iterations, use_concat, function(err, results) {
   console.log(Baseline',      results[0]);
   console.log('Concat speed', results[1]);
});
```

Compare to approaches to see which is faster
--------------------------------------------
```javascript
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

timeit.howlong(iterations, [use_concat, use_plus], function(err, results) {
   console.log('Baseline',         results[0]);
   console.log('Concat speed',     results[1]);
   console.log('Using Plus speed', results[1]);
});
```

Example Compare Output
=============

    Baseline { total_runtime: 151,
      total_step_runtime: 28,
      average_step_runtime: 0.0009333333333333333 }
    Concat speed { total_runtime: 149,
      total_step_runtime: 36,
      average_step_runtime: 0.0012,
      total_off_baseline: -2,
      total_step_off_baseline: 8,
      average_step_off_baseline: 0.00026666666666666657 }
    Using Plus speed { total_runtime: 141,
      total_step_runtime: 44,
      average_step_runtime: 0.0014666666666666667,
      total_off_baseline: -10,
      total_step_off_baseline: 16,
      average_step_off_baseline: 0.0005333333333333334 }


TODO
====
Be able to test parallell execution as well as serial.  This is important when comparing to methods where one is async and the other is not.

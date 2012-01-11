Provide a simple interface for testing how fast different methods are.

Installation
------------
    git clone git@github.com:my8bird/nodejs-timeit.git
    npm install


Usage
-----

Compare to approaches to see which is faster
===========================================

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
        timeit.howlong(iterations, use_concat, function(err, concat_values) {
            timeit.howlong(iterations, use_plus, function(err, plus_values) {
                // Show the results
                console.log('Concat speed', concat_values);
                console.log('Using Plus speed', plus_values);
            });
        });
    });

Example Output
=============

    Concat speed { total_runtime: 146,
      total_step_runtime: 38,
      average_step_runtime: 0.0012666666666666666,
      total_off_baseline: 5,
      total_step_off_baseline: 11,
      average_step_off_baseline: 0.0003666666666666666 }
    Using Plus speed { total_runtime: 135,
      total_step_runtime: 29,
      average_step_runtime: 0.0009666666666666667,
      total_off_baseline: -6,
      total_step_off_baseline: 2,
      average_step_off_baseline: 0.0000666666666666667 }

TODO
----
Push to npm

Be able to test parallell execution as well as serial.  This is important when comparing to methods where one is async and the other is not.
